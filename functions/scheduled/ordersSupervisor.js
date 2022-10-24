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
                if (shipment.state == 'shipped') {
                  admin
                    .firestore()
                    .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                    .update({
                      state: 'shipped',
                      status: 6,
                    });
                } else if(shipment.state == 'ready'){
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
                }
                admin
                  .firestore()
                  .doc('SPREE_ORDERS_' + stockLocation.id + '/' + doc.id)
                  .update({
                    shipment_number: shipment.number,
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
