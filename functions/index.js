const functions = require('firebase-functions');
const admin = require('firebase-admin');

const cabifyEstimates = require('./cabify');
const uberDispatcher = require('./uber')("ydQvqFF87tXeoLqlzGeFCT5LDLLzXrKl","M8AEI2Qf023-NlvXDIaZu6PUZTBRoS95c8Atdm1N", "2648bc3d-7ebe-4154-a42e-c2dfe94a0075");
const uberDebugDispatcher = require('./uber')("knJa-FrOl2QHzkcnoG3gnWsj0VqXbVme","uze9hsr1-89pgi-7zRohC0f3RIJDBReMtI5caWJn", "ba030355-7cc4-4922-98a1-0c706aced46e");
const HmxDispatcher = require('./hermex');

const cors = require('cors')({ origin: true });
const Geocoder = require('./geocoder');
const { default: axios } = require('axios');
const { env } = require('process');
const { orderInitialState } = require('./fillOrderState');
const sendNoti = require('./handlers/sendFcmNotifications');
const spree = require('./utils/spree/spree');

admin.initializeApp();

const PRODUCTION = env.PRODUCTION === 'true';
const DEBUG = true;
const DEBUG_EMAILS = [
  "marco@lomi.cl",
  "orlando@lomi.cl",
]

const DEBUG_NUMBER = "+56935103087"
const FORCE_STATE_ON_DELIVERY = "En despacho"

const STORE_PICKING_STATE = 0
const SCHEDULED_STATE = 1
const PENDING_STATE = 2
const ON_PICKING_STATE = 3
const WAITING_AT_DRIVER_STATE = 4
const DELIVERING_ORDER_STATE = 5
const FINISHED_STATE = 6
const FAILED = 7

//Spree
//const spreeUrl = "https://lomi-dev.herokuapp.com/";
const spreeUrl = "https://lomi.cl/";
const token = "8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3";
const spreeDebugUrl = "https://lomi-dev.herokuapp.com/";
const spreeUtils = require('./utils/spree/spree')(spreeUrl, token, spreeDebugUrl);
//End spree environment

//Imported Scheduled functions
const spreeScheduled = require('./scheduled/spreeScheduled')(spreeUrl, token, admin);
exports.spreeScheduled = spreeScheduled

const orderSupervisor = require('./scheduled/ordersSupervisor')(spreeUrl, token, admin, spreeDebugUrl);
exports.orderSupervisor = orderSupervisor
// End Scheduled functions

//Imported API functions
const sendNotificationByType = require('./https/sendNotificationByType')(admin);
exports.sendNotificationByType = sendNotificationByType

const listenToUberStatusWebHook = require('./https/webhooks/uberStatus')(admin);
exports.listenToUberStatusWebHook = listenToUberStatusWebHook

const createCabifyTripEndpoint = require('./https/requestCabify')(admin);
exports.createCabifyTripEndpoint = createCabifyTripEndpoint

const cancelCabifyTripEndpoint = require('./https/cancelCabify')(admin);
exports.cancelCabifyTripEndpoint = cancelCabifyTripEndpoint
//End Imported API functions

//Imported Handlers
exports.sendFcmNotificationOnNewOrder = functions.https.onRequest(
  async (request, response) => {
    const { number, stock_location, stock_location_id} = request.body
    
    const tokens = await admin.firestore().doc('backoffice-app/fcmTokens').get()
    const tokensData = tokens.data()
    let tokensToPush = []
    Object.entries(tokensData).map(entry => {
      if (entry[1].notifications && entry[1].notifications.find(n => n.includes(`SPREE_ORDERS_${stock_location_id}`))) {
        if (!Object.values(tokensToPush).find(t => t === entry[1].token)) tokensToPush.push({ userId: entry[1].userId, tokens: entry[1].token})
      }
    })
    
    tokensToPush.forEach(async element => {
      try {
        await admin.messaging().send({
          token: element.tokens,
          notification: {
            title: `Tienda ${stock_location.split("-")[0]}`,
            body: `Nueva Orden #${number}`,
          },
          data: {
            number: number
          },
          webpush: {
            notification: {
              click_action: '/orders'
            }
          }
        })
        await admin.firestore().doc(`backoffice-users/${element.userId}`).collection('notifications').add({
          notification: {
            title: `Tienda ${stock_location.split("-")[0]}`,
            body: `Nueva Orden #${number}`,
          }
        })
      } catch (error) {
        console.log(error)
      }
    })
    response.status(200).send('OK')
  }
)
//End of Imported Handlers

//Imported Firestore listeners
const listenToRolAssigned = require('./firestore/listenToRolAssign')(admin);
exports.rolAssigned = listenToRolAssigned
//End of Imported Firestore listeners

// // Create and Deploy Your First Cloud Functions

exports.addCompletedOrder = functions.https.onRequest(
  async (request, response) => {
    const order = request.body;
    collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
    order.completed_at = new Date(order.completed_at);
    order.status = 2;
    const credentialsRef = admin.firestore().collection(collectionKey).doc(order.number);
    await credentialsRef.set(order);    
    let orderExpanded = await spreeUtils.getOrder(order.number).catch(e => console.log(e));
    if(orderExpanded == 'broken'){
      orderExpanded = await spreeUtils.getDebugOrder(order.number);
      orderExpanded.debug = true;
    } else {
      orderExpanded.debug = false;
    }
    if(orderExpanded != 'broken'){
      const isRetiroEnTienda = orderExpanded.ship_address.firstname.includes('Retiro') || orderExpanded.ship_address.company == "LOMI";
      credentialsRef.update({
        isStorePicking: isRetiroEnTienda,
        status: isRetiroEnTienda ? 0 : 2,
        DEBUG: orderExpanded.debug
      })
    }

    await sendNoti(order.shipment_stock_location_name, order.number, order.shipment_stock_location_id)
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
    const stockLocations = (await spreeUtils.getStockLocations()).stock_locations
    const order = request.body;
    const address1 = stockLocations.find(loc=>loc.id==order.shipment_stock_location_id).address1
    order.shipment_stock_location_name = address1
    const stops = await Geocoder.getOrderStops(order);
    const selectedUberDispatcher = order.DEBUG ? uberDebugDispatcher : uberDispatcher
    await selectedUberDispatcher.auth();
    const uberEstimated = await selectedUberDispatcher.createQuote(
      order.ship_address_address1 +
        ', ' +
        order.ship_address_state +
        ', ' +
        order.ship_address_country,
      order.shipment_stock_location_name,
      order
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

exports.cancelUberTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try{
      const selectedUberDispatcher = order.DEBUG ? uberDebugDispatcher : uberDispatcher
      await selectedUberDispatcher.auth();
      const tripId = request.body.tripId;
      const trip = await selectedUberDispatcher.getTrip(tripId);
      if(trip){
        const cancelTrip = await selectedUberDispatcher.cancelTrip(tripId);
        return response.status(200).send(cancelTrip);
      }else{
        return response.status(200).send("No trip found");
      }
    } catch(e){
      return response.status(500).send(e);
    }
  });
});

exports.createHmxTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const hmxOrder = await HmxDispatcher.placeOrder(request.body);
    const order = request.body;
    if(hmxOrder.status === 200){

      // SET DOCUMENT INFORMATION
      const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const orderDocRef = admin.firestore().doc(collectionKey + '/' + order.number)
      await orderDocRef.update({
        status: DELIVERING_ORDER_STATE
      })
      const orderJourneyDocRef = admin.firestore().doc(collectionKey + '/' + order.number + '/journeys/' + hmxOrder.data.trackingId)
      const orderJourneyPayload = {
        status: hmxOrder.data.status,
        id: hmxOrder.data.trackingId,
        orderNumber: hmxOrder.data.orderId,
        stock_location_id: order.shipment_stock_location_id,
        providerId: 2,
      }
      await orderJourneyDocRef.set(orderJourneyPayload)

      const journeyDocRef = admin.firestore().doc('deliveringJourneys/' + hmxOrder.data.trackingId)
      await journeyDocRef.set(orderJourneyPayload)
      //SET DOCUMENT INFORMATION COULD BE A FUNCTION

      return response.status(200).send(hmxOrder.data);
    } else {
      return response.status(500).send(hmxOrder.data);
    }
  })
})

exports.cancelHmxTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const hmxOrder = await HmxDispatcher.cancelTrip(request.body.journeyId);
    const order = request.body
    if(hmxOrder.status === 200){
            // SET DOCUMENT INFORMATION
            const collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
            const orderDocRef = admin.firestore().doc(collectionKey + '/' + order.number)
            await orderDocRef.update({
              status: WAITING_AT_DRIVER_STATE
            })
            const orderJourneyDocRef = admin.firestore().doc(collectionKey + '/' + order.number + '/journeys/' + hmxOrder.data.trackingId)
            const orderJourneyPayload = {
              status: "canceled",
            }
            await orderJourneyDocRef.update(orderJourneyPayload)
      
            const journeyDocRef = admin.firestore().doc('deliveringJourneys/' + hmxOrder.data.trackingId)
            await journeyDocRef.delete()
            //SET DOCUMENT INFORMATION COULD BE A FUNCTION

            return response.status(200).send(hmxOrder.data);
    }
    return response.status(500).send(hmxOrder.data);
  })
})

exports.creatUberTrip = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const order = request.body;
      const selectedUberDispatcher = order.DEBUG ? uberDebugDispatcher : uberDispatcher
      console.log(selectedUberDispatcher.accessToken, selectedUberDispatcher.customerId, selectedUberDispatcher.clientId)
      await selectedUberDispatcher.auth()
      const uberTrip = await selectedUberDispatcher.createTrip(
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
        order.line_items.map(item => ({price: item.price, size: "medium", quantity: item.quantity, name: item.name})),
        order
      );
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin
        .firestore()
        .doc(collectionKey + '/' + order.number)
      ref.update({
        status: DELIVERING_ORDER_STATE,
      })

      const snapshot = await ref.get()
      if(uberTrip){
        if(snapshot.exists){
          const order = snapshot.data();
          const journey = {
            id: ref.collection("journeys").doc().id,
            status: uberTrip.status,
            orderNumber: order.number,
            stock_location_id: order.shipment_stock_location_id,
            uberTrip: uberTrip,
            providerId: 1,
          }
          await ref.collection("journeys").doc(journey.id).set(journey);
          await admin
          .firestore().doc("deliveringJourneys/" + journey.id).set(journey);
          return response.status(200).json(journey);
        }
        return response.status(500).json({
          kind: "error",
          code: uberTrip.code,
          message: uberTrip.message,
          params: uberTrip.params,
        });
      }
      return response.status(500).send("Ha ocurrido un error desconocido al crear el viaje");
    } catch (e) {
      return response.status(e.status ? e.status : 500).json(e);
    }
  });
});

exports.scheduledFunction = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
  const snapshot = await admin.firestore().collection("deliveringJourneys").get()
  await Promise.all(snapshot.docs.map(async (doc)=>{
    console.log(doc.data(), "doc.data()")
    let trip;
    if(doc.data().uberTrip){
      const selectedUberDispatcher = order.DEBUG ? uberDebugDispatcher : uberDispatcher
      await selectedUberDispatcher.auth()
      trip = await selectedUberDispatcher.getTrip(doc.data().uberTrip.id)
    } else if(doc.data().providerId == 2){
      trip = (await HmxDispatcher.getOrderStatus(doc.data().id)).data.data
      console.log(trip, "trip")
      if(trip.status.id == 8 ){
        trip.complete = true
        trip.status = "delivered"
      } else if(trip.status.id == 9){
        trip.complete = true
        trip.status = "canceled"
      } else{
        trip.status = trip.status.name
      }
    } else if(doc.data().providerId == 3){
      await cabifyEstimates.authCabify();
      trip = await cabifyEstimates.getCabifyTrip(doc.data().id)
      console.log(trip)
      if(trip.data.journey.endAt){
        trip.complete = true;
        trip.status = trip.data.journey.endState == "rider cancel" ? 'canceled' : 'delivered'
      }
    }
    const journeyDoc = admin.firestore().doc("deliveringJourneys/" + doc.id)
    
    if(trip.complete){
      await journeyDoc.delete()
      admin.firestore().doc("SPREE_ORDERS_" + doc.data().stock_location_id + "/" + doc.data().orderNumber).update({
        status: trip.status == 'canceled' ? WAITING_AT_DRIVER_STATE : trip.status == 'returned' ? FAILED : trip.status == 'delivered' ? FINISHED_STATE : DELIVERING_ORDER_STATE,
        reason: trip.status == 'returned' ? trip.undeliverable_reason : ''
      })
    } else {
      if(doc.data().providerId == 2){
        await journeyDoc.update({
          status: trip.status,
          updatedAt: new Date(),
          hmxTrip: trip
        })
      } else if(doc.data().providerId == 3)  {
        await journeyDoc.update({
          status: trip.status,
          updatedAt: new Date(),
          cabifyTrip: trip
        })
      }
    }
    
    await admin.firestore().doc("SPREE_ORDERS_" + doc.data().stock_location_id + "/" + doc.data().orderNumber + "/journeys/" + doc.data().id).update({
      status: trip.status,
      updatedAt: new Date(),
      uberTrip: trip
    })

  }))
  return null;
});

function statusAdapter(status){
    switch(status){
      case PENDING_STATE:
        return "confirmado";
      case ON_PICKING_STATE:
        return "preparando pedido";
      case WAITING_AT_DRIVER_STATE:
        return "listo para el despacho";
      case DELIVERING_ORDER_STATE:
        return "en despacho";
      case FINISHED_STATE:
        return "Entregado";
    }


  }

  exports.listenToOrderStatusChange39 = functions.firestore.document('SPREE_ORDERS_39/{docId}').onUpdate(async (change, context) => {
    console.log(context.resource.name.includes("SPREE_ORDERS"), context.resource.name, "context.resource.name")
    const order = change.after.data();
    const previousOrder = change.before.data();
    if(order.status == previousOrder.status){
      return
    }
    if(!order.status){
      console.log(order)
      return
    }
    console.log(order)
    if(order.status == WAITING_AT_DRIVER_STATE){
      spreeUtils.markShipmentAsReady(order.number, order.shipment_stock_location_id).catch(e=>console.log(e)).then(()=>{
        console.log("Shipment marked as ready")
      })
    }

    if(DEBUG || !PRODUCTION  ){
      DEBUG_EMAILS.forEach((email)=>{
        axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification', {
          email: email,
          status: statusAdapter(order.status),
          data: {
            ruta: 'tabs/orders',
          }
        })
      })
    } else {
      if(order.user_email){
        axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification', {
          email: "", //order.user_email,
          status: statusAdapter(order.status)
        })
      }
    }
  
    return null;
  });

exports.listenToOrderStatusChange = functions.firestore.document('SPREE_ORDERS_1/{docId}').onUpdate(async (change, context) => {
  console.log(context.resource.name.includes("SPREE_ORDERS"), context.resource.name, "context.resource.name")
  const order = change.after.data();
  const previousOrder = change.before.data();
  if(order.status == previousOrder.status){
    return
  }
  if(!order.status){
    console.log(order)
    return
  }
  console.log(order)
  if(DEBUG || !PRODUCTION  ){
    DEBUG_EMAILS.forEach((email)=>{
      axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification', {
        email: email,
        status: statusAdapter(order.status),
        data: {
          ruta: 'tabs/orders',
        }
      })
    })
  } else {
    if(order.user_email){
      axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification', {
        email: "", //order.user_email,
        status: statusAdapter(order.status)
      })
    }
  }

  return null;
});

exports.showLastOrders = functions.https.onRequest(async (request, response) => {
  const stockLocation = request.query.stockLocation ? request.query.stockLocation : 1;
  const limit = request.query.limit ? parseInt(request.query.limit) : 25;
  const startsAt = request.query.startsAt ? new Date(request.query.startsAt) : new Date();
  const endsAt = request.query.endsAt ? new Date(request.query.endsAt) : new Date();



  cors(request, response, async () => {
    try {
      let snapshot = await admin
        .firestore()
        .collection("SPREE_ORDERS_"+stockLocation)
        .orderBy('completed_at', 'desc')
      if(request.query.startsAt){
        snapshot = snapshot.where('completed_at', '>=', new Date(startsAt))
      }
      if(request.query.endsAt){
        snapshot = snapshot.where('completed_at', '<=', new Date(endsAt))
      }
      snapshot = await snapshot.limit(limit).get()
      const orders = snapshot.docs.map((doc) => {
        const data = doc.data();
        data.line_items = data.line_items.map((item) => item.id)
        delete data.uberTrip;
        delete data.uberEstimated;
        delete data.cabifyEstimated;
        return {...orderInitialState, ...data};
      })
      return response.status(200).send(orders);
    } catch (e) {
      return response.status(e.status ? e.status : 500).send(e);
    }
  });
})