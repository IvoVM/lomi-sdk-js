const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    const listenToCabifyStatusWebHook = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const statusJson = req.body;
            const db = admin.firestore();
            const journeyDoc = admin.firestore().doc("deliveringJourneys/" + req.body.id)
            const journeyDocData = await journeyDoc.get()
            let journey;
            if(journeyDocData.exists){
                journey = journeyDocData.data()
            } else {
                console.log("Journey not found", req.body.id, req.body.external_id)
                const orderNumber = req.body.external_id.split("_")[0]
                const vehicleType = req.body.external_id.split("_")[1]
                const expandedOrder = 
                res.status(200).send("Event received")
                return
            }
            console.log("updating",req.body.id, journey.id, "with", req.body.state)
            const orderJourneyDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber + "/journeys/" + journey.id)
            const orderDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber)
            await orderJourneyDoc.update({
                status: req.body.state,
                updatedAt: new Date(),
                cabifyTrip: req.body
            })
            if(req.body.state == 'delivered' || req.body.state == 'returned' || req.body.state == 'incident' || req.body.state == 'pickupfailed' || req.body.state == 'internalcanceled' || req.body.state == 'requestercancel'){
                if(req.body.state == 'returned' || req.body.state == 'incident' || req.body.state == 'pickupfailed' || req.body.state == 'internalcanceled' || req.body.state == 'requestercancel'){
                    await orderDoc.update({
                        status: 4
                    })
                } else {
                    await orderDoc.update({
                        status: 6
                    })
                }
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