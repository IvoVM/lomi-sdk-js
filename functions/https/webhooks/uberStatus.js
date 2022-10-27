const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    const listenToUberStatusWebHook = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const statusJson = req.body;
            const db = admin.firestore();
            console.log(req.body)
            const orderId = req.body.deliver_id;
            const status = req.body.status;
            const journeyDoc = admin.firestore().doc("deliveringJourneys/" + orderId)
            const newStatus = status
            console.log(newStatus, "newStatus")
            
            if(newStatus == 'delivered'){
              await journeyDoc.delete()
            } else {
              await journeyDoc.update({
                status: status,
                updatedAt: new Date(),
              })
            }
            
            res.send(newStatus);
            return res.status(200).send('Event received')
        })

    });

    return listenToUberStatusWebHook;
}