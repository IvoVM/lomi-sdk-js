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
            const journey = (await journeyDoc.get()).data()
            console.log(journey, orderId)
            const orderJourneyDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber + "/journeys/" + journey.id)
            const orderDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber)
            console.log(newStatus , req.body.data.external_id, "newStatus")
            
            await orderJourneyDoc.update({
              status: status,
              updatedAt: new Date(),
              [ journey.uberTrip ? 'uberTrip' : 'uberFourWheelsTrip'] : req.body.data
            })
            if(newStatus == 'delivered'){
              await journeyDoc.delete()
              await orderDoc.update({
                status: 6
              })
            } 
            else if(newStatus == 'canceled' || newStatus == 'returned'){
              await journeyDoc.delete()
              await orderDoc.update({
                status: 4
              })
            } else {
              await journeyDoc.update({
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