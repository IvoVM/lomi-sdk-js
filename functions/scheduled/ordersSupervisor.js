const functions = require('firebase-functions');

module.exports = (spreeUrl, token, admin, spreeDebugUrl) => {
  const spree = require('../utils/spree/spree')(spreeUrl, token, admin, spreeDebugUrl);

  const ordersSupervisor = functions.pubsub
    .schedule('* * * * *')
    .onRun(async (context) => {
      const stockLocations = (await spree.getStockLocations()).stock_locations;
      stockLocations.forEach(async (stockLocation) => {
        const docsRef = admin
          .firestore()
          .collection('SPREE_ORDERS_' + stockLocation.id);
        const ordersSnapshot = await docsRef
          .where('state', 'not-in', ['shipped', 'broken', 'Out of time'])
          .limit(30)
          .get();
        console.log('SPREE_ORDERS_' + stockLocation.id, 'Doc Id');
        if (ordersSnapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        ordersSnapshot.forEach((doc) => {
          try {
            spree.getShipments(doc.id, doc.data().DEBUG).then((shipments) => {
                console.log(doc.id)              

                if (shipments == 'broken') {
                    admin
                    .firestore()
                    .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                    .update({
                      state: 'broken',
                      status: 6,
                    }).then(() => {
                        console.log("Order "+doc.id+" Updated")
                    })
                    return
                }

              shipments.forEach((shipment) => {
                console.log(shipment.number, 'Shipment number');
                if (shipment.state == 'shipped' && doc.data().status != 6) {
                  console.log("Marking shipment as shipped in firebase")
                  admin
                    .firestore()
                    .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                    .update({
                      state: 'shipped',
                      status: 6,
                    });
                } else if(doc.data().status == 6 && shipment.state == 'ready'){
                  console.log("Marking shipment as shipped in spree")
                  spree.markShipmentAsShipped(shipment.number).then(()=>{
                    console.log("Shipment "+shipment.number+" marked as shipped")
                  })
                } else if(shipment.state == 'ready' && doc.data().status < 4){
                  console.log("Shipment "+shipment.number+" marking as ready in firebase")
                    spree.getJourneys(shipment.id).then((journeys) => {
                      journeys.forEach((journey) => {
                        console.log(journey.id, stockLocation.id, doc.id, 'Journeys')
                        admin
                          .firestore()
                          .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                          .update({
                              status: journey.state.includes(["drop off"]) ? 6 : 5
                          })
                        
                        admin
                          .firestore()
                          .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                          .collection('journeys')
                          .doc(journey.id.toString())
                          .set(journey);
                      });
                    })
                    console.log(new Date(doc.data().completed_at.seconds*1000), 'Completed at', doc.data().completed_at);
                    if(new Date(doc.data().completed_at.seconds*1000).getTime() + 1000 * 60 * 60 * 24 * 4 < new Date().getTime()){
                    admin
                    .firestore()
                    .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                    .update({
                      state: 'Out of time',
                      status: 6,
                    });
                    }
                  }else if(doc.data().status >= 4 && shipment.state != 'ready'){
                    console.log("Shipment "+shipment.number+" marking as ready in spree")
                    spree.markShipmentAsReady(shipment.number).then(()=>{
                      console.log("Shipment "+shipment.number+" marked as ready in spree")
                      admin
                        .firestore()
                        .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                        .update({
                          state: "ready"
                        })
                    })
                  }
                admin
                  .firestore()
                  .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                  .update({
                    shipment_number: shipment.number,
                    shipment_id: shipment.id,
                    shipment_state: shipment.state,
                  });
              });
            });
          } catch (e) {
            console.log(e.error);
          }
        });
      });
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(20000);
    });

  return {
    ordersSupervisor,
  };
};
