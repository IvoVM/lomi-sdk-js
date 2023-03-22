const functions = require('firebase-functions');
const admin = require('firebase-admin');

const cabifyEstimates = require('./cabify');
const uberDispatcher = require('./uber')(
  'ydQvqFF87tXeoLqlzGeFCT5LDLLzXrKl',
  'M8AEI2Qf023-NlvXDIaZu6PUZTBRoS95c8Atdm1N',
  '2648bc3d-7ebe-4154-a42e-c2dfe94a0075'
);
const uberDebugDispatcher = require('./uber')(
  'knJa-FrOl2QHzkcnoG3gnWsj0VqXbVme',
  'uze9hsr1-89pgi-7zRohC0f3RIJDBReMtI5caWJn',
  'ba030355-7cc4-4922-98a1-0c706aced46e'
);
const uberFourWheelsDispatcher = require('./uber')(
  '12DtgZG9GdP01Pwj4F5I60O5PU-jH-lE',
  'U4BjK7MnhLIAfixrkePc8A89VrKWHS7mccX2fitt',
  '3bc20eef-481a-4942-94f1-ecb5a15ddd6e',
);
const HmxDispatcher = require('./hermex');
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "https://b1f2ced1d2a34132b09bb411caba3f12@o1122273.ingest.sentry.io/4504815267086336",
  tracesSampleRate: 1.0,
});

const cors = require('cors')({ origin: true });
const Geocoder = require('./geocoder');
const { default: axios } = require('axios');
const { env } = require('process');
const { orderInitialState } = require('./fillOrderState');
const sendNoti = require('./handlers/sendFcmNotifications');
const spree = require('./utils/spree/spree');
const Algolia  = require('./libraries/algolia')

admin.initializeApp();
const firebaseLomiUtils = require('./utils/firebase/resources')(admin);
const PRODUCTION = env.PRODUCTION === 'true';
const DEBUG = true;
const DEBUG_EMAILS = ['marco@lomi.cl', 'orlando@lomi.cl'];

const DEBUG_NUMBER = '+56935103087';
const FORCE_STATE_ON_DELIVERY = 'En despacho';

const STORE_PICKING_STATE = 0;
const SCHEDULED_STATE = 1;
const PENDING_STATE = 2;
const ON_PICKING_STATE = 3;
const WAITING_AT_DRIVER_STATE = 4;
const DELIVERING_ORDER_STATE = 5;
const FINISHED_STATE = 6;
const FAILED = 7;

//Spree
//const spreeUrl = "https://lomi-dev.herokuapp.com/";
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
const spreeUtils = require('./utils/spree/spree')(
  spreeUrl,
  token,
  spreeDebugUrl
);
//End spree environment

//Imported Scheduled functions
const spreeScheduled = require('./scheduled/spreeScheduled')(
  spreeUrl,
  token,
  admin
);
exports.spreeScheduled = spreeScheduled;

const orderSupervisor = require('./scheduled/ordersSupervisor')(
  spreeUrl,
  token,
  admin,
  spreeDebugUrl
);
exports.orderSupervisor = orderSupervisor;
// End Scheduled functions

//Imported API functions
const sendNotificationByType = require('./https/sendNotificationByType')(admin);
exports.sendNotificationByType = sendNotificationByType;

const listenToUberStatusWebHook = require('./https/webhooks/uberStatus')(admin);
exports.listenToUberStatusWebHook = listenToUberStatusWebHook;

const listenToCabifyStatusWebHook = require('./https/webhooks/cabifyStatus')(admin);
exports.listenToCabifyStatusWebHook = listenToCabifyStatusWebHook;

const createCabifyTripEndpoint = require('./https/requestCabify')(admin);
exports.createCabifyTripEndpoint = createCabifyTripEndpoint;

const cancelCabifyTripEndpoint = require('./https/cancelCabify')(admin);
exports.cancelCabifyTripEndpoint = cancelCabifyTripEndpoint;

const listenToSlackEvents = require('./https/webhooks/slackEvents')(admin);
exports.listenToSlackEvents = listenToSlackEvents

const getDeliveryTimes = require('./https/api/getDeliveryTimes')(admin);
exports.getDeliveryTimes = getDeliveryTimes.apiGetOrdersDeliveryTimes;

const reverseGeocoding = require('./https/api/reverseGeocoding')(admin);
exports.reverseGeocoding = reverseGeocoding.reverseGeocoding;
//End Imported API functions

//Imported Handlers
exports.sendFcmNotificationOnNewOrder = functions.https.onRequest(
  async (request, response) => {
    const { number, stock_location, stock_location_id } = request.body;

    const tokens = await admin
      .firestore()
      .doc('backoffice-app/fcmTokens')
      .get();
    const tokensData = tokens.data();
    let tokensToPush = [];
    Object.entries(tokensData).map((entry) => {
      if (
        entry[1].notifications &&
        entry[1].notifications.find((n) =>
          n.includes(`SPREE_ORDERS_${stock_location_id}`)
        )
      ) {
        if (!Object.values(tokensToPush).find((t) => t === entry[1].token))
          tokensToPush.push({
            userId: entry[1].userId,
            tokens: entry[1].token,
          });
      }
    });

    tokensToPush.forEach(async (element) => {
      try {
        await admin.messaging().send({
          token: element.tokens,
          notification: {
            title: `Tienda ${stock_location.split('-')[0]}`,
            body: `Nueva Orden #${number}`,
          },
          data: {
            number: number,
          },
          webpush: {
            notification: {
              click_action: '/orders',
            },
          },
        });
        await admin
          .firestore()
          .doc(`backoffice-users/${element.userId}`)
          .collection('notifications')
          .add({
            notification: {
              title: `Tienda ${stock_location.split('-')[0]}`,
              body: `Nueva Orden #${number}`,
            },
          });
      } catch (error) {
        console.log(error);
      }
    });
    response.status(200).send('OK');
  }
);
//End of Imported Handlers

//Imported Firestore listeners
const listenToRolAssigned = require('./firestore/listenToRolAssign')(admin);
exports.rolAssigned = listenToRolAssigned;
//End of Imported Firestore listeners

// // Create and Deploy Your First Cloud Functions

exports.addCompletedOrder = functions.https.onRequest(
  async (request, response) => {
    const order = request.body;
    collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
    order.completed_at = new Date(order.completed_at);
    order.status = 2;
    const credentialsRef = admin
      .firestore()
      .collection(collectionKey)
      .doc(order.number);
    await credentialsRef.set(order);
    let orderExpanded = await spreeUtils
      .getOrder(order.number)
      .catch((e) => console.log(e));
    if (orderExpanded == '  broken') {
      orderExpanded = await spreeUtils.getDebugOrder(order.number);
      orderExpanded.debug = true;
    } else {
      orderExpanded.debug = false;
    }
    if (orderExpanded != 'broken') {
      const isRetiroEnTienda =
        orderExpanded.ship_address.firstname.includes('Retiro') ||
        orderExpanded.ship_address.company == 'LOMI';
      credentialsRef.update({
        isStorePicking: isRetiroEnTienda,
        status: isRetiroEnTienda ? 0 : 2,
        line_items_expanded : orderExpanded.line_items,
        DEBUG: orderExpanded.debug,
        token: orderExpanded.token,
        shipment_id: orderExpanded.shipments[0].id,
        shipment_state: orderExpanded.shipments[0].state,
        shipment_number: orderExpanded.shipments[0].tracking,
      });
    }

    Algolia.saveRecordToAlgolia(order)

    await sendNoti(
      order.shipment_stock_location_name,
      order.number,
      order.shipment_stock_location_id
    );


    return response.send('ok');
  }
);

exports.geocodeOrder = functions.https.onRequest(
  async(request, response) => {
    cors(request, response, async () => {
      const order = request.body
      
      const stockLocations = (await spreeUtils.getStockLocations()).stock_locations;
      const orderStockLocation = stockLocations.find(
        (loc) => loc.id == order.shipment_stock_location_id
      );
      order.shipment_stock_location_name = orderStockLocation.address1;
      order.shipment_stock_location_phone = orderStockLocation.phone;
      order.shipment_stock_location_city = orderStockLocation.city;
      order.shipment_stock_location_notes = orderStockLocation.address2;

      const stops = await Geocoder.getOrderStops(order, true)
      const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number)
        .update({
          stops,
        });
      return response.status(200).send({...order, stops: stops});
    })
  }
)

exports.evaluateCabify = 
functions.https.onRequest(
  Sentry.GCPFunction.wrapHttpFunction(
    async (request, response) => {
      cors(request, response, async () => {
        const stockLocations = (await spreeUtils.getStockLocations()).stock_locations;
        const order = request.body;
        const orderStockLocation = stockLocations.find(
          (loc) => loc.id == order.shipment_stock_location_id
        );

        const firebaseStockLocation = await firebaseLomiUtils.getStockLocationResource(order.shipment_stock_location_id)
        order.shipment_stock_location_uber_name = firebaseStockLocation.uber_store_name;

        order.shipment_stock_location_name = orderStockLocation.address1;
        order.shipment_stock_location_phone = orderStockLocation.phone;
        order.shipment_stock_location_city = orderStockLocation.city;
        order.shipment_stock_location_notes = orderStockLocation.address2;

        const stops = await Geocoder.getOrderStops(order);
          console.log("stops", stops)
        const cabifyEstimated = await cabifyEstimates.setCabifyEstimates(order);
          console.log('cabifyEstimated', cabifyEstimated)
        const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
        
        const ref = await admin
          .firestore()
          .doc(collectionKey + '/' + order.number)
          .update({
            cabifyEstimated: cabifyEstimated.cabifyEstimated,
            cabifyEstimated4W: cabifyEstimated.cabifyEstimated4W,
            stops,
          });
        return response.status(200).send(cabifyEstimated);
      });
    }
  )
)


exports.evaluateFourWheelsUber = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const stockLocations = (await spreeUtils.getStockLocations())
      .stock_locations;
    const order = request.body;
    const orderStockLocation = stockLocations.find(
      (loc) => loc.id == order.shipment_stock_location_id
    );
    order.shipment_stock_location_name = orderStockLocation.address1;
    order.shipment_stock_location_city = orderStockLocation.city;
    order.shipment_stock_location_phone = orderStockLocation.phone;
    order.shipment_stock_location_notes = orderStockLocation.address2;

    const stops = await Geocoder.getOrderStops(order);
    console.log(stops);
    let selectedUberDispatcher = uberFourWheelsDispatcher;
    if(order.DEBUG){
     selectedUberDispatcher = uberDispatcherDebug; 
    }
    await selectedUberDispatcher.auth();
    const uberFourWheelsEstimated = await selectedUberDispatcher.createQuote(order);
    collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
    const ref = await admin
      .firestore()
      .doc(collectionKey + '/' + order.number)
      .update({
        uberFourWheelsEstimated,
        stops,
      });
    return response.status(200).send(uberFourWheelsEstimated);
  });
});

exports.evaluateUber = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try{

      const stockLocations = (await spreeUtils.getStockLocations())
        .stock_locations;
      const order = request.body;
      const orderStockLocation = stockLocations.find(
        (loc) => loc.id == order.shipment_stock_location_id
      );
      const firebaseStockLocation = await firebaseLomiUtils.getStockLocationResource(order.shipment_stock_location_id)
      console.log(firebaseStockLocation, "firebaseStockLocation")
      order.shipment_stock_location_email = firebaseStockLocation.email;
      order.shipment_stock_location_uber_name = firebaseStockLocation.uber_store_name;
      order.shipment_stock_location_notes = firebaseStockLocation.notes;

      order.shipment_stock_location_name = orderStockLocation.address1;
      order.shipment_stock_location_phone = orderStockLocation.phone;
      order.shipment_stock_location_city = orderStockLocation.city;

      order.ship_address_phone = order.ship_address_phone.replace(/ /g, "")
      

      const stops = await Geocoder.getOrderStops(order);
      console.log(stops);
      let selectedUberDispatcher = uberDispatcher;
      if(order.DEBUG){
       selectedUberDispatcher = uberDispatcherDebug; 
      }
      await selectedUberDispatcher.auth();
      const uberEstimated = await selectedUberDispatcher.createQuote(order);
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number)
        .update({
          
          uberEstimated,
          stops,
        });
      return response.status(200).send(uberEstimated);
    } catch(e){
      console.log(e);
      return response.status(500).send(e);
    }
  });
});

exports.cancelFourWheelsUberTrip = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, async () => {
        const selectedUberDispatcher = request.body.DEBUG
          ? uberDebugDispatcher
          : uberFourWheelsDispatcher;
        await selectedUberDispatcher.auth();
        const tripId = request.body.tripId;
        const trip = await selectedUberDispatcher.getTrip(tripId);
        console.log("canceling", tripId)
        if (trip) {
          const cancelTrip = await selectedUberDispatcher.cancelTrip(tripId);
          return response.status(200).send(cancelTrip);
        } else {
          return response.status(200).send('No trip found');
        }
    });
  }
);

exports.cancelUberTrip = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, async () => {
      try {
        const selectedUberDispatcher = request.body.DEBUG
          ? uberDebugDispatcher
          : uberDispatcher;
        await selectedUberDispatcher.auth();
        const tripId = request.body.tripId;
        const trip = await selectedUberDispatcher.getTrip(tripId);
        if (trip) {
          const cancelTrip = await selectedUberDispatcher.cancelTrip(tripId);
          return response.status(200).send(cancelTrip);
        } else {
          return response.status(200).send('No trip found');
        }
      } catch (e) {
        return response.status(500).send(e);
      }
    });
  }
);

exports.createHmxTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const hmxOrder = await HmxDispatcher.placeOrder(request.body);
    const order = request.body;
    if (hmxOrder.status === 200) {
      const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const orderDocRef = admin
        .firestore()
        .doc(collectionKey + '/' + order.number);
      await orderDocRef.update({
        status: DELIVERING_ORDER_STATE,
      });
      const orderJourneyDocRef = admin
        .firestore()
        .doc(
          collectionKey +
            '/' +
            order.number +
            '/journeys/' +
            hmxOrder.data.trackingId
        );
      const orderJourneyPayload = {
        status: hmxOrder.data.status,
        id: hmxOrder.data.trackingId,
        orderNumber: hmxOrder.data.orderId,
        stock_location_id: order.shipment_stock_location_id,
        providerId: 2,
      };
      await orderJourneyDocRef.set(orderJourneyPayload);
      const journeyDocRef = admin
        .firestore()
        .doc('deliveringJourneys/' + hmxOrder.data.trackingId);
      await journeyDocRef.set(orderJourneyPayload);
      //await spreeUtils.createJourney(order.shipment_id, orderJourneyPayload.id, "12", order.)

      return response.status(200).send(hmxOrder.data);
    } else {
      return response.status(500).send(hmxOrder.data);
    }
  });
});

exports.cancelHmxTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const hmxOrder = await HmxDispatcher.cancelTrip(request.body.journeyId);
    const order = request.body;
    if (hmxOrder.status === 200) {
      // SET DOCUMENT INFORMATION
      const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const orderDocRef = admin
        .firestore()
        .doc(collectionKey + '/' + order.number);
      await orderDocRef.update({
        status: WAITING_AT_DRIVER_STATE,
      });
      const orderJourneyDocRef = admin
        .firestore()
        .doc(
          collectionKey +
            '/' +
            order.number +
            '/journeys/' +
            hmxOrder.data.trackingId
        );
      const orderJourneyPayload = {
        status: 'canceled',
      };
      await orderJourneyDocRef.update(orderJourneyPayload);

      const journeyDocRef = admin
        .firestore()
        .doc('deliveringJourneys/' + hmxOrder.data.trackingId);
      await journeyDocRef.delete();
      //SET DOCUMENT INFORMATION COULD BE A FUNCTION

      return response.status(200).send(hmxOrder.data);
    }
    return response.status(500).send(hmxOrder.data);
  });
});

exports.creatUberTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const order = request.body;
      const stockLocations = (await spreeUtils.getStockLocations()).stock_locations;
        const orderStockLocation = stockLocations.find(
          (loc) => loc.id == order.shipment_stock_location_id
        );
      console.log(stockLocations)

      const firebaseStockLocation = await firebaseLomiUtils.getStockLocationResource(order.shipment_stock_location_id)
      console.log(firebaseStockLocation, "firebaseStockLocation")
      order.shipment_stock_location_email = firebaseStockLocation.email;
      order.shipment_stock_location_uber_name = firebaseStockLocation.uber_store_name;
      order.shipment_stock_location_notes = firebaseStockLocation.notes;
      order.shipment_stock_location_phone = firebaseStockLocation.phone;

      order.shipment_stock_location_name = orderStockLocation.address1;
      order.shipment_stock_location_city = orderStockLocation.city;
      order.shipment_stock_location_state = orderStockLocation.state;


      order.ship_address_phone = order.ship_address_phone.replace(/ /g, "")
      
      const selectedUberDispatcher = order.DEBUG
        ? uberDebugDispatcher
        : uberDispatcher;
      console.log(
        selectedUberDispatcher.accessToken,
        selectedUberDispatcher.customerId,
        selectedUberDispatcher.clientId
      );
      await selectedUberDispatcher.auth();
      const uberTrip = await selectedUberDispatcher.createTrip(
        order.stops
          ? order.stops[1].loc.join(',')
          : order.ship_address_address1 +
              ', ' +
              order.ship_address_city +
              ', ' +
              order.ship_address_country,
        order.name,
        order.ship_address_phone,
        order.stops
          ? order.stops[0].loc.join(',')
          : order.shipment_stock_location_name,
        'Lomi Spa',
        order.shipment_stock_location_phone,
        order.line_items.map((item) => ({
          price: item.price,
          size: 'small',
          quantity: item.quantity,
          name: item.name,
        })),
        order
      );
      if(uberTrip?.error){
        return response.status(500).send(uberTrip);
      }
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number);
      ref.update({
        status: WAITING_AT_DRIVER_STATE,
      });

      
      const snapshot = await ref.get();
      if (uberTrip) {
        if (snapshot.exists) {
          const order = snapshot.data();
          const journey = {
            id: uberTrip.id,
            status: uberTrip.status,
            orderNumber: order.number,
            stock_location_id: order.shipment_stock_location_id,
            uberTrip: uberTrip,
            providerId: 1,
            trackingUrl: "No Tracking"
          };
          await ref.collection('journeys').doc(uberTrip.id).set(journey);
          await admin
            .firestore()
            .doc('deliveringJourneys/' + uberTrip.id)
            .set(journey);
            try{
              await spreeUtils.createJourney(journey, order.shipment_id, order.token)
            } catch(e){
              console.log("Error creating journey uber 2W", )
            }
          return response.status(200).json(journey);
        }
        return response.status(500).json({
          kind: 'error',
          code: uberTrip.code,
          message: uberTrip.message,
          params: uberTrip.params,
        });
      }
      return response
        .status(500)
        .send('Ha ocurrido un error desconocido al crear el viaje');
  });
});

exports.creatFourWheelsUberTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const order = request.body;
      const stockLocations = (await spreeUtils.getStockLocations()).stock_locations;
        const orderStockLocation = stockLocations.find(
          (loc) => loc.id == order.shipment_stock_location_id
        );
      const firebaseStockLocation = await firebaseLomiUtils.getStockLocationResource(order.shipment_stock_location_id)
      order.shipment_stock_location_email = firebaseStockLocation.email;
      order.shipment_stock_location_uber_name = firebaseStockLocation.uber_store_name;
      order.shipment_stock_location_notes = firebaseStockLocation.notes;
      order.shipment_stock_location_phone = firebaseStockLocation.phone;

      order.shipment_stock_location_name = orderStockLocation.address1;
      order.shipment_stock_location_city = orderStockLocation.city;
      order.shipment_stock_location_state = orderStockLocation.state;

      order.ship_address_phone = order.ship_address_phone.replace(/ /g, "")

      const selectedUberDispatcher = order.DEBUG
        ? uberDebugDispatcher
        : uberFourWheelsDispatcher;
        await selectedUberDispatcher.auth();
        console.log(
          selectedUberDispatcher.accessToken,
          selectedUberDispatcher.customerId,
          selectedUberDispatcher.clientId
        );
      const uberTrip = await selectedUberDispatcher.createTrip(
        order.stops
          ? order.stops[1].loc.join(',')
          : order.ship_address_address1 +
              ', ' +
              order.ship_address_city +
              ', ' +
              order.ship_address_country,
        order.name,
        order.ship_address_phone,
        order.stops
          ? order.stops[0].loc.join(',')
          : order.shipment_stock_location_name,
        'Lomi Spa',
        order.shipment_stock_location_phone,
        order.line_items.map((item) => ({
          price: item.price,
          size: 'large',
          quantity: item.quantity,
          name: item.name,
        })),
        order
      );
      if(uberTrip?.error){
        return response.status(500).send(uberTrip);
      }
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number);
      ref.update({
        status: WAITING_AT_DRIVER_STATE,
      });

      const snapshot = await ref.get();
      if (uberTrip) {
        if (snapshot.exists) {
          const order = snapshot.data();
          const journey = {
            id: uberTrip.id,
            status: uberTrip.status,
            orderNumber: order.number,
            stock_location_id: order.shipment_stock_location_id,
            uberFourWheelsTrip: uberTrip,
            providerId: 1,
            trackingUrl: "No Tracking"
          };
          await ref.collection('journeys').doc(uberTrip.id).set(journey);
          await admin
            .firestore()
            .doc('deliveringJourneys/' + uberTrip.id)
            .set(journey);
          try{
            await spreeUtils.createJourney(journey, order.shipment_id , order.token)
          } catch(e){
            console.log("Error at creating journey")
          }
          return response.status(200).json(journey);
        }
        return response.status(500).json({
          kind: 'error',
          code: uberTrip.code,
          message: uberTrip.message,
          params: uberTrip.params,
        });
      }
      return response
        .status(500)
        .send('Ha ocurrido un error desconocido al crear el viaje');
  });
});

function statusAdapter(status) {
  switch (status) {
    case PENDING_STATE:
      return 'confirmado';
    case ON_PICKING_STATE:
      return 'preparando pedido';
    case WAITING_AT_DRIVER_STATE:
      return 'listo para el despacho';
    case DELIVERING_ORDER_STATE:
      return 'en despacho';
    case FINISHED_STATE:
      return 'Entregado';
  }
}

exports.showLastOrders = functions.https.onRequest(
  async (request, response) => {
    const stockLocation = request.query.stockLocation
      ? request.query.stockLocation
      : 1;
    const limit = request.query.limit ? parseInt(request.query.limit) : 25;
    const startsAt = request.query.startsAt
      ? new Date(request.query.startsAt)
      : new Date();
    const endsAt = request.query.endsAt
      ? new Date(request.query.endsAt)
      : new Date();

    cors(request, response, async () => {
      try {
        let snapshot = await admin
          .firestore()
          .collection('SPREE_ORDERS_' + stockLocation)
          .orderBy('completed_at', 'desc');
        if (request.query.startsAt) {
          snapshot = snapshot.where('completed_at', '>=', new Date(startsAt));
        }
        if (request.query.endsAt) {
          snapshot = snapshot.where('completed_at', '<=', new Date(endsAt));
        }
        snapshot = await snapshot.limit(limit).get();
        const orders = snapshot.docs.map((doc) => {
          const data = doc.data();
          data.line_items = data.line_items.map((item) => item.id);
          delete data.uberTrip;
          delete data.uberEstimated;
          delete data.cabifyEstimated;
          return { ...orderInitialState, ...data };
        });
        return response.status(200).send(orders);
      } catch (e) {
        return response.status(e.status ? e.status : 500).send(e);
      }
    });
  }
);

function axiosHandleError(error) {
  console.log(error);
  return null;
}

function sendPushToOrderUserOfCurrentStatus(order){
  if (order.email) {
    console.log("Sending push to user: ", order.email, " with status: ", order.status, "")
    return axios.post(
      'https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification',
      {
        email: order.DEBUG ? '' : order.email,
        status: statusAdapter(order.status),
      }
    ).catch(axiosHandleError);
  }
}

exports.watchAllOrders = functions.firestore.document('{collectionName}/{docId}').onUpdate(async (change, context) => {
  console.log("Changes in :", context.params.collectionName, context.params.docId);
  const collectionName = context.params.collectionName;
  if(collectionName.includes("SPREE_ORDERS")){
    const order = change.after.data();
    const previousOrder = change.before.data();
    order.completed_at = new Date(order.completed_at.seconds * 1000);
    Algolia.updateRecordToAlgolia(order).then(() => console.log("Order updated in algolia")).catch((e) => console.log(e));
  
    if(previousOrder.status != order.status){
      await sendPushToOrderUserOfCurrentStatus(order);
      if(order.status == 3){
        const evaluateUber = axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/evaluateUber', order).catch(axiosHandleError)
        const evaluateFourWheelsUber = axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/evaluateFourWheelsUber', order).catch(axiosHandleError)
        const evaluateCabify = axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/evaluateCabify', order).catch(axiosHandleError)
      }
    }
  }
})