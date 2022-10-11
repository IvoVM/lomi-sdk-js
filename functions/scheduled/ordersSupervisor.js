const functions = require('firebase-functions');


module.exports = (spreeUrl, token, admin) => {
    
    const spree = require('../utils/spree/spree')(spreeUrl, token, admin);

    const ordersSupervisor = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
            const stockLocations = (await spree.getStockLocations()).stock_locations;
            stockLocations.forEach(async (stockLocation) => {
                const docsRef =  admin.firestore().collection("SPREE_ORDERS_"+stockLocation.id)
                const ordersSnapshot = await docsRef.where("status", "!=", "shipped").limit(50).get();
                console.log("SPREE_ORDERS_"+stockLocation.id,"Doc Id")
                if (ordersSnapshot.empty) {
                    console.log('No matching documents.');
                    return;
                  }  
                  
                  ordersSnapshot.forEach(doc => {
                    spree.getShipments(doc.id).then((shipments) => {
                        shipments.forEach((shipment) => {
                            console.log(shipment.number,"Shipment number")
                            if(shipment.state == 'shipped'){
                                admin.firestore().doc("SPREE_ORDERS_"+stockLocation.id+"/"+doc.id).update({
                                    state: "shipped",
                                    status: 8,
                                })
                            } 
                            admin.firestore().doc("SPREE_ORDERS_"+stockLocation.id+"/"+doc.id).update({
                                shipment_number: shipment.number,
                                shipment_state: shipment.state,
                            })
                        })
                    })
                  });
            });
    })

    return {
        ordersSupervisor
    }

}