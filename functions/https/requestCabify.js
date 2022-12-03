const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
const spreeUtils = require('../utils/spree/spree')(spreeUrl, token, spreeDebugUrl);

module.exports = (admin) => {
    const cabify = require('../cabify');
    const journeysUtils = require('../utils/journeys')(admin);

    const requestCabify = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const order = req.body;
            const stockLocations = (await spreeUtils.getStockLocations()).stock_locations;
              const orderStockLocation = stockLocations.find(
                (loc) => loc.id == order.shipment_stock_location_id
              );
            console.log(stockLocations)
            order.shipment_stock_location_name = orderStockLocation.address1;
            order.shipment_stock_location_phone = orderStockLocation.phone;
            order.shipment_stock_location_city = orderStockLocation.city;
            await cabify.authCabify();
            const cabifyResponse = await cabify.createCabifyTrip(order, req.body.productId);
            await journeysUtils.createJourney(cabifyResponse.data.data.createJourney.id, 3 , {
                cabifyTrip : cabifyResponse.data.data.createJourney,
            }, order);
            res.send(cabifyResponse.data);
        })

    });

    return requestCabify;
}