const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

module.exports = (admin) => {
    const cabify = require('../cabify');
    const journeysUtils = require('../utils/journeys')(admin);

    const cancelCabify = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const order = req.body;
            await cabify.authCabify();
            const cabifyResponse = await cabify.cancelCabifyTrip(order.tripId);
            await journeysUtils.cancelJourney(cabifyResponse.data.cancelJourney.id, order);
            res.send(cabifyResponse);
        })

    });

    return cancelCabify;
}