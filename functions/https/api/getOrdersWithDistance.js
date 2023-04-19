const firebaseUtils = require("../../utils/firebase/firebase");
const firebaseResourceUtils = require("../../utils/firebase/resources");
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '4GB'
  }
  

module.exports = (admin) => {

    const timestampToDate = (timestamp) => {
        return timestamp ? new Date(timestamp.seconds * 1000 ) : timestamp
    }

    const convertOrderToDeliveryTime = (order) => {
        return {
            number: order.number || null,
            completed_at: timestampToDate(order.completed_at) || null,
            courier_at_store: timestampToDate(order.store_rider_picked_at) || null,
            courier_at_dropoff: timestampToDate(order.courier_at_dropoff) || null,
            delivered_at: timestampToDate(order.store_rider_delivered_at) || null,
            assignment_time: timestampToDate(order.request_deliver_at) || null,
            picking_time: timestampToDate(order.picked_at) || null
        }
    };

    const getOrderJourneys = async (order) => {
        const orderJourneys = await firebaseUtils(admin).getFirebaseCollection("SPREE_ORDERS"+order.shipment_stock_location_id+"/"+order.number+"/journeys"+order.number, 10000);
        return orderJourneys.map(journey => {
            return {
                ...journey,
                created_at: timestampToDate(journey.created_at) || null,
                updated_at: timestampToDate(journey.updated_at) || null
            }
        });
    };
    
    const getStoreOrdersDeliveryTimes = async (stockLocationId, limit = 0) => {
        let stockLocationOrdersCollection
        if(limit){
            stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollection("SPREE_ORDERS_"+stockLocationId, limit);
        } else {
            stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollection("SPREE_ORDERS_"+stockLocationId, 10000);
        }
        stockLocationOrdersCollection.forEach(order => {

        });
        return stockLocationOrdersCollection.map(convertOrderToDeliveryTime);
    };
    
    const getAllOrdersDeliveryTimes = async (limit = 0) => {
        const stockLocations = await firebaseResourceUtils(admin).getResourcesCollectionStockLocations();
        const stockLocationsIds = stockLocations.map(stockLocation => stockLocation.stockLocationId);
        const stockLocationsOrders = await Promise.all(stockLocationsIds.map(stockLocationId => getStoreOrdersDeliveryTimes(stockLocationId, limit)));
        return stockLocationsOrders.reduce((acc, orders) => acc.concat(orders), []);
    };

    const apiGetOrdersDeliveryTimes = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
        cors(req, res, async () => {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined
            const ordersDeliveryTimes = await getAllOrdersDeliveryTimes(limit);
            res.send(ordersDeliveryTimes);
        });
    });

    return {
        apiGetOrdersDeliveryTimes
    }

}