const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    const listenToUberStatusWebHook = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const statusJson = req.body;
            const db = admin.firestore();
            console.log(req.body)
            const orderId = req.body.delivery_id;
            const status = req.body.data.status;
            const journeyDoc = admin.firestore().doc("deliveringJourneys/" + orderId)
            const newStatus = status
            const journey = await journeyDoc.get()
            const orderJourneyDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + orderId + "/journeys/" + journey.id)
            console.log(newStatus, "newStatus")
            
            if(newStatus == 'delivered'){
              await journeyDoc.delete()
            } else {
              await journeyDoc.update({
                status: status,
                updatedAt: new Date(),
                [ journey.uberTrip ? 'uberTrip' : 'uberFourWheelsTrip'] : req.body.data
              })
              await orderJourneyDoc.update({
                status: status,
                updatedAt: new Date(),
                [ journey.uberTrip ? 'uberTrip' : 'uberFourWheelsTrip'] : req.body.data
              })
            }
            
            


            res.send(newStatus);
            return res.status(200).send('Event received')
        })

    });

    return listenToUberStatusWebHook;
}