const functions = require('firebase-functions');
const cabify = 
module.exports = (spreeUrl, token, admin) => {
    
    const spree = require('../utils/spree/spree')(spreeUrl, token, admin);
    const { getUser } = require('../cabify');
    
    const spreeScheduled = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {

        const stockLocations = await spree.getStockLocations();
        console.log(stockLocations)

        const resourcesDoc = await admin.firestore().doc("backoffice-app/resources");
        const resources = await resourcesDoc.get();

        const privilegesDoc = await admin.firestore().doc("backoffice-app/userPrivileges");
        const privileges = await privilegesDoc.get();

        stockLocations.stock_locations.forEach(async (stockLocation) => {
            if(true){
                const email = resources["SPREE_ORDERS_"+stockLocation.id].email;
                let cabifyUser = null;
                if(email){
                    cabifyUser = await getUser(resources["SPREE_ORDERS_"+stockLocation.id]);
                }
                privilegesDoc.update({
                    ["SPREE_ORDERS_"+stockLocation.id]: {
                        id: "SPREE_ORDERS_"+stockLocation.id,
                        name: "SPREE_ORDERS_"+stockLocation.id,
                    }
                })
                resourcesDoc.update({
                    ["SPREE_ORDERS_"+stockLocation.id]: {
                        id: "SPREE_ORDERS_"+stockLocation.id,
                        name: stockLocation.name,
                        stockLocationId: stockLocation.id,
                        type: "SPREE_STOCK_LOCATION",
                        address: stockLocation.address1,
                        address2: stockLocation.address2,
                        phone: stockLocation.phone,
                        state: stockLocation.state.name,
                        city: stockLocation.city,
                        country: stockLocation.country.name,
                        state: stockLocation.state.name,
                        cabifyUid: cabifyUser ? cabifyUser.id : null,
                        email: stockLocation.email ? stockLocation.email : "Sin correo",
                        ...resources["SPREE_ORDERS_"+stockLocation.id]
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