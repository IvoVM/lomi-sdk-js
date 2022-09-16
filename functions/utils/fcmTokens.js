const functions = require('firebase-functions');

module.exports = (admin) => {

    const getTokensByNotificationType = async (type) => {
        const tokens = await admin.firestore().doc('backoffice-app/fcmTokens').get();
        const tokensData = tokens.data();
        const tokensValues = Object.values(tokensData);
        const tokensFiltered = tokensValues.filter((token) => token.notifications.includes(type));
        console.log(tokensFiltered.map((token) => token.token), 'tokensFiltered');
        return tokensFiltered.map((token) => token.token);
    }

    const sendNotification = async (notification, tokens) => {
        const fcm = admin.messaging();
        const message = {
            notification,
            tokens,
        };
        try {
            const response = await fcm.sendToDevice(tokens,notification);
            return response;
        } catch (error) {
            console.log('Error sending message:', error);
            return error;
        }
    }

    const getTokensByEmail = async (email) => {
        const fcmTokensDocument= admin.firestore().doc('backoffice-app/fcmTokens');
        const user = await admin.firestore().collection('backoffice-users').where('email', '==', email).get();
        const userData = user.docs[0].data();
        const userId = userData.id;
        return fcmTokensDocument.get().then((doc) => {
            if(doc.exists){
                const tokens = Object.values(doc.data());
                const tokensByEmail = tokens.filter((token) => token.userId == userId);
                return tokensByEmail;
            }else{
                return [];
            }
        })
    }

    const updateFcmTokens = async (update) => {
        const fcmTokensDocument= admin.firestore().doc('backoffice-app/fcmTokens');
        return fcmTokensDocument.get().then((doc) => {
            if(doc.exists){
                return fcmTokensDocument.update(update);
            }else{
                return fcmTokensDocument.set({tokens: []});
            }
        })
    };

    return {
        getTokensByEmail,
        updateFcmTokens,
        getTokensByNotificationType,
        sendNotification,
    }
}