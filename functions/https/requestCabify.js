const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

module.exports = (admin) => {
    const cabify = require('../cabify');
    const journeysUtils = require('../utils/journeys')(admin);

    const requestCabify = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const order = req.body;
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