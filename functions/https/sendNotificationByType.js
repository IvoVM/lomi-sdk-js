const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

module.exports = (admin) => {
    const fcmTokensUtils = require('../utils/fcmTokens')(admin);

    const exportFunctionForSendNotificationByType = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const type = req.body.data.type;
            const db = admin.firestore();
            const tokens = await fcmTokensUtils.getTokensByNotificationType(type);
            const sendNotificationResponse = await fcmTokensUtils.sendNotification(req.body, tokens);
            res.send(sendNotificationResponse);
        })
    });

    return exportFunctionForSendNotificationByType;
}