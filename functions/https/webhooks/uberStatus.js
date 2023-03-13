const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

module.exports = (admin) => {
  const journeyUtils = require('../../utils/journeys.js')(admin);
  const statesUtils = require('../../utils/states.js');

  async function updateJourney(journey) {
    console.log("Updating journey", "id: " + journey.id, "status: " + journey.status)
    const spreeStatusEquivalent = statesUtils.decodeUberStatus(journey.status)
    journey.trackingUrl = "No tracking url available"
    journeyUtils.updateJourney(spreeStatusEquivalent,journey);
  }

  const listenToUberStatusWebHook = functions.https.onRequest(
    async (req, res) => {
      cors(req, res, async () => {
        const journeyId = req.body.delivery_id;
        const status = req.body.data.status;
        const journeyDoc = admin.firestore().doc('deliveringJourneys/' + journeyId);
        const newStatus = status;
        console.log("New status is: ", newStatus)
        const trackingUrl = req.body
        const journey = (await journeyDoc.get()).data();
        const newJourney = {
          ...journey,
          status: newStatus,
          [journey.uberTrip ? 'uberTrip' : 'uberFourWheelsTrip']: req.body.data,
        };
        await updateJourney(newJourney);
        res.send(newStatus);
      });
    }
  );

  return listenToUberStatusWebHook;
};
