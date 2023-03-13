const functions = require('firebase-functions');
const { shipment_stock_location_email } = require('../utils/mocks/order');
const cors = require('cors')({ origin: true });
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';

module.exports = (admin) => {
    const cabify = require('../cabify');
    const journeysUtils = require('../utils/journeys')(admin);
    const firebaseLomiUtils = require('../utils/firebase/resources')(admin);

    const requestCabify = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const order = req.body;
            const vehicleType = req.body.vehicleType
            console.log("Requesting for ", vehicleType )
            order.ship_address_phone = order.ship_address_phone.replace(/ /g, "")
            /**
            const stockLocations = (await spreeUtils.getStockLocations()).stock_locations;
              const orderStockLocation = stockLocations.find(
                (loc) => loc.id == order.shipment_stock_location_id
              );
            console.log(stockLocations)
            order.shipment_stock_location_phone = orderStockLocation.phone;
            order.shipment_stock_location_city = orderStockLocation.city;
            order.shipment_stock_location_notes = orderStockLocation.address2;
            order.shipment_stock_location_name = orderStockLocation.address1;
            */


            await cabify.authCabify();

            const firebaseStoreResources = await firebaseLomiUtils.getStockLocationResource(order.shipment_stock_location_id)
            console.log(firebaseStoreResources)

            order.shipment_stock_location_email = firebaseStoreResources.email;

            const cabifyUser = (await cabify.getUser(firebaseStoreResources.email)).data.user;
            order.cabify_requester_id = cabifyUser.id;

            const cabifyResponse = await cabify.createCabifyTrip(order, vehicleType);
            console.log(cabifyResponse)
            
            if(cabifyResponse.errors){
                res.send(cabifyResponse)
                return
            }
            
            const parcelId = vehicleType == "4W" ? order.cabifyEstimated4W.parcel_ids[0] : order.cabifyEstimated.parcel_ids[0]
            await journeysUtils.createJourney(parcelId, 3 , {
                cabifyLogisticsTrip: cabifyResponse.data.deliveries,
                shipment_stock_location_email: order.shipment_stock_location_email,
                cabify_requester_id: order.cabify_requester_id,
            }, order);
            res.send(cabifyResponse.data);
        })

    });

    return requestCabify;
}