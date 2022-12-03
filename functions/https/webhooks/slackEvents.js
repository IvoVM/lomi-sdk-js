const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { createEventAdapter } = require('@slack/events-api');
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    const listenToSlackEvents = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const body = req.body;
            const db = admin.firestore();
            console.log(body)
            return res.status(200).send('Event received')
        })

    });

    return listenToSlackEvents;
}