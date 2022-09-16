const functions = require('firebase-functions');

module.exports = (admin) => {
    const db = admin.firestore();
    const fcm = admin.messaging();

    const listenToNewOrder = functions.firestore.document('SPREE_ORDERS_1/{docId}').onCreate(async (snap, context) => {
        const newValue = snap.data();
        const { number, state } = newValue;

        const tokens = await db.doc('backoffice-app/fcmTokens').get();
        const tokensData = tokens.data();
        const deviceTokens = Object.keys(tokensData);

        const tokensValues = Object.values(tokensData);
   

        if (state === 'complete') {
            const message = {
                notification: {
                    title: `Tienda ${order.shipment_stock_location_name.split("-")[0]}`,
                    body: `Nueva Orden #${number}`,
                },
            };

            try {
                const response = await fcm.sendToDevice(deviceTokens, message);
                tokensValues.forEach((token) => {
                    if (response.results[0].error) {
                        throw new Error('Failure sending notification to', token);
                    } else {
                        const userDoc = db.doc(`backoffice-users/${token.userId}/notifications/${response.results[0].messageId}`);
                        userDoc.set({
                            ...message,
                            id: response.results[0].messageId,
                        })
                        console.log('Successfully sent message:', response);
                    }
                })
                return response;
            } catch (error) {
                console.log('Error sending message:', error);
                return error;
            }
        }
    })
    
    return listenToNewOrder;
}