const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = (admin) => {
    const db = admin.firestore();
    const fcm = admin.messaging();

    const listenToNewOrder = functions.firestore.document('SPREE_ORDERS_1/{docId}').onCreate(async (snap, context) => {
        const newValue = snap.data();
        const { number, state } = newValue;

        const tokens = await db.document('backoffice-app/fcmTokens').get();
        const tokensData = tokens.data();
        const deviceTokens = Object.values(tokensData);

        if (state === 'complete') {
            const message = {
                notification: {
                    title: 'New order',
                    body: `Order #${number} has been placed`,
                },
                topic: 'orders',
            };

            try {
                const response = await fcm.sendToDevice(deviceTokens, message);
                return response;
            } catch (error) {
                console.log('Error sending message:', error);
                return error;
            }
        }
    })
    
    return listenToNewOrder;
}