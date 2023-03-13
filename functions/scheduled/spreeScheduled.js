const functions = require('firebase-functions');
const order = require('../utils/mocks/order');
module.exports = (spreeUrl, token, admin) => {
    
    const spree = require('../utils/spree/spree')(spreeUrl, token, admin);
    const { authCabify, getUser } = require('../cabify');
    
    const spreeScheduled = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {

        const stockLocations = await spree.getStockLocations();
        console.log(stockLocations.stock_locations.map(stockLocation => ""+stockLocation.id+": "+stockLocation.name))

        const resourcesDocReference = await admin.firestore().doc("backoffice-app/resources");
        const resourcesDoc = await resourcesDocReference.get();
        const resources = resourcesDoc.data();

        const privilegesDoc = await admin.firestore().doc("backoffice-app/userPrivileges");
        const privileges = await privilegesDoc.get();

        stockLocations.stock_locations.forEach(async (stockLocation) => {
            if(true){
                let cabifyUser = null;
                try{
                    const email = resources["SPREE_ORDERS_"+stockLocation.id].email;
                    if(email){
                        await authCabify();
                        cabifyUser = await getUser(email);
                    }
                    console.log("Cabify user for", stockLocation.id, cabifyUser)
                } catch(e){
                    console.log("Error getting cabify user for", stockLocation.id, e.response?.statusText ? e.response.statusText + ": "+e.response.status : 'Error sin respuesta')
                }
                console.log("Cabify user for ", stockLocation.name+": ", stockLocation.id, cabifyUser)
                const oldResource = resources["SPREE_ORDERS_"+stockLocation.id] ? resources["SPREE_ORDERS_"+stockLocation.id] : {};
                resourcesDocReference.update({
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
                        country: stockLocation.country?.name ? stockLocation.country.name : "Chile",
                        state: stockLocation.state.name,
                        email: stockLocation.email ? stockLocation.email : "tiendach"+order.shipment_stock_location_id+"@lomi.cl",
                        ...resources["SPREE_ORDERS_"+stockLocation.id],
                        cabifyUid: cabifyUser ? cabifyUser.id : 'fc04184452337656491a6a4b28ae26e3',
                    }
                })
                privilegesDoc.update({
                    ["SPREE_ORDERS_"+stockLocation.id]: {
                        id: "SPREE_ORDERS_"+stockLocation.id,
                        name: "SPREE_ORDERS_"+stockLocation.id,
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