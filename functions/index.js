const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cabifyEstimates = require('./cabify');
const uberDispatcher = require('./uber');
const cors = require('cors')({ origin: true });
const Geocoder = require('./geocoder');
admin.initializeApp();

const DEBUG_NUMBER = "+56935103087"
const FORCE_STATE_ON_DELIVERY = "En despacho"

const STORE_PICKING_STATE = 0
const SCHEDULED_STATE = 1
const PENDING_STATE = 2
const ON_PICKING_STATE = 3
const WAITING_AT_DRIVER_STATE = 4
const DELIVERING_ORDER_STATE = 5
const FINISHED_STATE = 6

exports.addCompletedOrder = functions.https.onRequest(
  async (request, response) => {
    const order = request.body;
    collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
    order.completed_at = new Date(order.completed_at);
    const credentialsRef = admin.firestore().collection(collectionKey).doc(order.number);
    credentialsRef.set(order);
    return response.send('ok');
  }
);

exports.evaluateCabify = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, async () => {
      const order = request.body;
      const stops = await Geocoder.getOrderStops(order);
      const cabifyEstimated = await cabifyEstimates.setCabifyEstimates(order);
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number)
        .update({
          cabifyEstimated,
          stops,
        });
      return response.status(200).send(cabifyEstimated);
    });
  }
);

exports.evaluateUber = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const order = request.body;
    const stops = await Geocoder.getOrderStops(order);
    await uberDispatcher.auth();
    const uberEstimated = await uberDispatcher.createQuote(
      order.ship_address_address1 +
        ', ' +
        order.ship_address_city +
        ', ' +
        order.ship_address_country,
      order.shipment_stock_location_name
    );
    collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
    const ref = await admin
      .firestore()
      .doc(collectionKey + '/' + order.number)
      .update({
        uberEstimated,
        stops,
      });
    return response.status(200).send(uberEstimated);
  });
});

exports.creatUberTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const order = request.body;
      await uberDispatcher.auth();
      const uberTrip = await uberDispatcher.createTrip(
        order.stops
          ? order.stops[1].loc.join(',')
          : order.ship_address_address1 +
              ', ' +
              order.ship_address_city +
              ', ' +
              order.ship_address_country,
        order.name,
        DEBUG_NUMBER,
        order.stops
          ? order.stops[0].loc.join(',')
          : order.shipment_stock_location_name,
        'Lomi Spa',
        DEBUG_NUMBER,
        order.line_items
      );
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number)
      ref.update({
        status: DELIVERING_ORDER_STATE,
      })

      const snapshot = await ref.get()
      if(snapshot.exists){
        const order = snapshot.data();
        const journey = {
          id: ref.collection("journeys").doc().id,
          status: uberTrip.status,
          orderNumber: order.number,
          stock_location_id: order.shipment_stock_location_id,
          uberTrip: uberTrip
        }
        await ref.collection("journeys").doc(journey.id).set(journey);
        await admin
        .firestore().doc("deliveringJourneys/" + journey.id).set(journey);
        return response.status(200).send(journey);
      }
      if(uberTrip){
        return response.status(500).send(uberTrip);
      }
      return response.status(500).send("Ha ocurrido un error desconocido al crear el viaje");
    } catch (e) {
      return response.status(e.status ? e.status : 500).send(e);
    }
  });
});

exports.scheduledFunction = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
  const snapshot = await admin.firestore().collection("deliveringJourneys").get()
  await Promise.all(snapshot.docs.map(async (doc)=>{
    console.log(doc)
    await uberDispatcher.auth()
    const trip = await uberDispatcher.getTrip(doc.data().uberTrip.id)
    const journeyDoc = admin.firestore().doc("deliveringJourneys/" + doc.id)
    
    if(trip.complete){
      await journeyDoc.delete()
      admin.firestore().doc("SPREE_ORDERS_" + doc.data().stock_location_id + "/" + doc.data().orderNumber).update({
        status: trip.status == 'canceled' ? WAITING_AT_DRIVER_STATE : FINISHED_STATE
      })
    } else {
      await journeyDoc.update({
        status: trip.status,
        updatedAt: new Date(),
        uberTrip: trip
      })
    }
    
    await admin.firestore().doc("SPREE_ORDERS_" + doc.data().stock_location_id + "/" + doc.data().orderNumber + "/journeys/" + doc.data().id).update({
      status: trip.status,
      updatedAt: new Date(),
      uberTrip: trip
    })

  }))
  return null;
});