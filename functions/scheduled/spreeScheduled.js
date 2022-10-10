const functions = require('firebase-functions');

module.exports = (spreeUrl, token, admin) => {
    
    const spree = require('../utils/spree/spree')(spreeUrl, token, admin);

    const spreeScheduled = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {

        const stockLocations = await spree.getStockLocations();
        console.log(stockLocations)

        const resourcesDoc = await admin.firestore().doc("backoffice-app/resources");
        const resources = await resourcesDoc.get();

        stockLocations.stock_locations.forEach(async (stockLocation) => {
            if(!resources["SPREE_ORDERS_"+stockLocation.id]){
                resourcesDoc.update({
                    ["SPREE_ORDERS"+stockLocation.id]: {
                        id: stockLocation.id,
                        name: stockLocation.name,
                        stockLocationId: stockLocation.id,
                        type: "SPREE_STOCK_LOCATION",
                    }
                })
            }
        })

        return stockLocations;
    })

    return {
        spreeScheduled
    }

}