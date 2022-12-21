const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    const listenToCabifyStatusWebHook = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const statusJson = req.body;
            const db = admin.firestore();
            const journeyDoc = admin.firestore().doc("deliveringJourneys/" + req.body.id)
            const journey = (await journeyDoc.get()).data()
            console.log(journey , req.body)
            const orderJourneyDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber + "/journeys/" + journey.id)

            await orderJourneyDoc.update({
                status: req.body.state,
                updatedAt: new Date(),
                cabifyTrip: req.body
            })
            if(req.body.state == 'delivered' || req.body.state == 'returned' || req.body.state == 'incident' || req.body.state == 'pickupfailed' || req.body.state == 'internalcanceled' || req.body.state == 'requestercancel'){
                await journeyDoc.delete()
            } else{
                await journeyDoc.update({
                    status: req.body.state,
                    updatedAt: new Date(),
                    cabifyTrip: req.body
                })
            }
            return res.status(200).send('Event received')
        })

    });

    return listenToCabifyStatusWebHook;
}