const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    const listenToUberStatusWebHook = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const statusJson = req.body;
            const newStatus = statusJson.meta.status;
            const db = admin.firestore();
        })

        const journeyDoc = admin.firestore().doc("deliveringJourneys/" + doc.id)

        console.log(newStatus, "newStatus")
        console.log(statusJson, "statusJson")
    
        if(newStatus == 'delivered'){
          await journeyDoc.delete()
        } else {
          await journeyDoc.update({
            status: trip.status,
            updatedAt: new Date(),
          })
        }

        res.send(newStatus);
    });

    return listenToUberStatusWebHook;
}