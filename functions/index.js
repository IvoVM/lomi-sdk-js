const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cabifyEstimates = require('./cabify');
const uberDispatcher = require('./uber');
const cors = require('cors')({ origin: true });
const Geocoder = require('./geocoder');
admin.initializeApp();

const DEBUG_NUMBER = "+56935103087"
const FORCE_STATE_ON_DELIVERY = "En despacho"

exports.addCompletedOrder = functions.https.onRequest(
  async (request, response) => {
    const order = request.body;
    collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;

    const credentialsRef = admin
      .firestore()
      .collection(collectionKey)
      .doc(order.number);
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

exports.refresUberTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try{
      const order = request.body;
      await uberDispatcher.auth();
      order.uberTrips = await Promise.all(order.uberTrips.map(
        async (trip)=>{
          const uberTrip = await uberDispatcher.getTrip(trip.id);
          return uberTrip
        }
      ))
      const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
      .firestore()
      .doc(collectionKey + '/' + order.number)
      .update({
        uberTrips: order.uberTrips,
        state: FORCE_STATE_ON_DELIVERY
      });
      return response.status(200).send(order.uberTrips);
    } catch (e){
      return response.status(500).send(e);
    }
  })
})

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
        .update({
          uberTrips: order.uberTrips ? order.uberTrips.concat(uberTrip) : [uberTrip],
          state: FORCE_STATE_ON_DELIVERY
        });
      return response.status(200).send(uberTrip);
    } catch (e) {
      return response.status(e.status ? e.status : 500).send(e);
    }
  });
});
