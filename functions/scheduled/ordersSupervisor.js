const functions = require('firebase-functions');
const order = require('../utils/mocks/order');

module.exports = (spreeUrl, token, admin, spreeDebugUrl) => {
  const spree = require('../utils/spree/spree')(spreeUrl, token, admin, spreeDebugUrl);

  const updateOrderWithShipmentInfo = async (order,shipment) => {
    console.log("Updating order with shipment info", "number: "+shipment.number, "state: "+shipment.state, "info: "+shipment.id)
    const docName = 'SPREE_ORDERS_' + order.shipment_stock_location_id + '/' + order.number;
    const updateObject = {
      shipment_number: shipment.number,
      shipment_id: shipment.id,
      shipment_state: shipment.state,
      state: shipment.state,
    }
    await admin.firestore().doc(docName).update(updateObject);
  }

  const nextOrderShipmentUntilCurrentStatusEquivalent = async (shipment, order) => {
    console.log("Next order shipment", "shipmentId: "+shipment.number, "for order: ", order.number, " in: ", order.status )
    response = false
    if(order.status >= 4 && shipment.state == 'pending'){
      response = await spree.markShipmentAsReady(shipment.number).catch((error) => {
        console.log("Error marking shipment " + shipment.number + " as ready", error)
      })
    }
    if(order.status == 6 && shipment.state == 'ready'){
      response = await spree.markShipmentAsShipped(shipment.number).catch((error) => {
        console.log("Error marking shipment " + shipment.number + " as shipped", error)
        return
      })
    }

    console.log(response)
    return response;
  }

  const syncroSingleOrder = async (order) => {
    console.log("Syncronizing order to spree", "number: "+order.number, "state: "+order.state, "info: "+order.id)
    console.log(order.number, "Order status is", order.status, "where complete at is", order.completed_at)
    if(new Date(order.completed_at).getTime() < new Date().getTime() - 1000 * 60 * 60 * 24 * 3){
      console.log("Order is too old to be syncronized", order.number)
      await admin.firestore().doc(docName).update({
        state: 'Out of time'
      });
      return
    }
    const shipments = order.shipments ? {
      shipments: order.shipments,
      xSpreeOrderToken: order.token
    } : await spree.getShipments(order.number)
    if(shipments == 'broken'){
      console.log("Error getting shipments for order", order.number)
      return
    } else {
      console.log("Shipments for order", order.number, "are", shipments?.map(shipment => shipment.number))
    }

    if(shipments.length > 0){
      if(order.state != shipments[0].state){
        await updateOrderWithShipmentInfo(order, shipments[0])
      }
      await nextOrderShipmentUntilCurrentStatusEquivalent(shipments[0], order)
    } else {
      console.log("No shipments for order", order.number + ": "+order.name + " - SL : ", order.shipment_stock_location_id)
    }
      

  }
  
  const syncroOrdersToSpree = async (stockLocation) => {
    console.log("Syncronizing orders to spree stockLocation: "+stockLocation.id)
    const docsRef = admin.firestore().collection('SPREE_ORDERS_' + stockLocation.id);
    const ordersDocuments = await docsRef.where('state', 'not-in', ['shipped', 'broken', 'Out of time']).limit(40).get();
    if(ordersDocuments.empty){
      console.log('No matching documents for: ', 'SPREE_ORDERS_' + stockLocation.id);
      return false;
    }
    
    console.log("Orders to syncronize: ", ordersDocuments.size)

    return Promise.all(
      ordersDocuments.docs.map(
        (orderDocument) => syncroSingleOrder(orderDocument.data())
        ));
  }

  const syncroAllOrdersOfStockLocationToSpree = async (stockLocation) => {
    await syncroOrdersToSpree(stockLocation)
  }

  const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '1GB'
  }

  const ordersSupervisor = functions
    .runWith(runtimeOpts)
    .pubsub
    .schedule('* * * * *')
    .onRun(async (context) => {
      const stockLocations = (await spree.getStockLocations()).stock_locations;
      stockLocations.forEach(async (stockLocation) => {
          syncroAllOrdersOfStockLocationToSpree(stockLocation)
        });
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(20000);
    });

  return {
    ordersSupervisor,
  };
};
