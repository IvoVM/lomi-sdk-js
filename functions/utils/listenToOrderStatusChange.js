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

exports.listenToOrderStatusChange40 = functions.firestore
  .document('SPREE_ORDERS_40/{docId}')
  .onUpdate(async (change, context) => {
    console.log(
      context.resource.name.includes('SPREE_ORDERS'),
      context.resource.name,
      'context.resource.name'
    );
    const order = change.after.data();
    const previousOrder = change.before.data();
    if (order.status == previousOrder.status) {
      return;
    }
    if (!order.status) {
      console.log(order);
      return;
    }
    console.log(order);
    if (order.status == WAITING_AT_DRIVER_STATE) {
      spreeUtils
        .markShipmentAsReady(order.number, order.shipment_stock_location_id)
        .catch((e) => console.log(e))
        .then(() => {
          console.log('Shipment marked as ready');
        });
    }

    if (order.email) {
        axios.post(
          'https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification',
          {
            email: order.email, //order.user_email,
            status: statusAdapter(order.status),
          }
        );
      }
    

    return null;
  });

exports.listenToOrderStatusChange39 = functions.firestore
  .document('SPREE_ORDERS_39/{docId}')
  .onUpdate(async (change, context) => {
    console.log(
      context.resource.name.includes('SPREE_ORDERS'),
      context.resource.name,
      'context.resource.name'
    );
    const order = change.after.data();
    const previousOrder = change.before.data();
    if (order.status == previousOrder.status) {
      return;
    }
    if (!order.status) {
      console.log(order);
      return;
    }
    console.log(order);
    if (order.status == WAITING_AT_DRIVER_STATE) {
      spreeUtils
        .markShipmentAsReady(order.number, order.shipment_stock_location_id)
        .catch((e) => console.log(e))
        .then(() => {
          console.log('Shipment marked as ready');
        });
    }

    if (DEBUG || !PRODUCTION) {
      DEBUG_EMAILS.forEach((email) => {
        axios.post(
          'https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification',
          {
            email: email,
            status: statusAdapter(order.status),
            data: {
              ruta: 'tabs/orders',
            },
          }
        );
      });
    } else {
      if (order.user_email) {
        axios.post(
          'https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification',
          {
            email: '', //order.user_email,
            status: statusAdapter(order.status),
          }
        );
      }
    }

    return null;
  });

  exports.listenToOrderStatusChange = functions.firestore
  .document('SPREE_ORDERS_1/{docId}')
  .onUpdate(async (change, context) => {
    console.log(
      context.resource.name.includes('SPREE_ORDERS'),
      context.resource.name,
      'context.resource.name'
    );
    const order = change.after.data();
    const previousOrder = change.before.data();
    if (order.status == previousOrder.status) {
      return;
    }
    if (!order.status) {
      console.log(order);
      return;
    }
    console.log(order);
    if (DEBUG || !PRODUCTION) {
      DEBUG_EMAILS.forEach((email) => {
        axios.post(
          'https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification',
          {
            email: email,
            status: statusAdapter(order.status),
            data: {
              ruta: 'tabs/orders',
            },
          }
        );
      });
    } else {
      if (order.user_email) {
        axios.post(
          'https://us-central1-lomi-35ab6.cloudfunctions.net/appPush/notification',
          {
            email: '', //order.user_email,
            status: statusAdapter(order.status),
          }
        );
      }
    }

    return null;
  });