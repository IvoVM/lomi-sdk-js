const functions = require('firebase-functions');

module.exports = (admin) => {
    const fcmTokens = require('../utils/fcmTokens')(admin);
    const userRolsUtils = require('../utils/userRols')(admin);

    const listenToRolAssign = functions.firestore.document('backoffice-users/{userId}').onWrite(async (change, context) => {
        const email = change.after.data().email;
        const beforeRol = change.before.data().userRol;
        const afterRol = change.after.data().userRol;
        const afterRolDefinition = await userRolsUtils.getUserRolById(afterRol);
        console.log('beforeRol', beforeRol);
        console.log('afterRol', afterRol);

        const userPrivelegesFiltered = await userRolsUtils.getUserRolPrivileges(afterRol);
        console.log(userPrivelegesFiltered);

        const collectionNewUserNotifications = userPrivelegesFiltered.map((privelege) => privelege.name+":NEW_USER");
        const collectionNewOrderNotifications = userPrivelegesFiltered.map((privelege) => privelege.name+":NEW_ORDER");
        const journeyCanceledNotification = userPrivelegesFiltered.map((privelege) => privelege.name+":JOURNEY_CANCELED");
        const journeyCompletedNotification = userPrivelegesFiltered.map((privelege) => privelege.name+":JOURNEY_COMPLETED");

        const allNotifications = [
            ...collectionNewOrderNotifications,
            ...journeyCanceledNotification,
            ...journeyCompletedNotification
        ]

        if(afterRolDefinition.rolName.includes("Jefe")){
            allNotifications.push(...collectionNewUserNotifications);
        }

        if(beforeRol != afterRol){
            const tokens = (await fcmTokens.getTokensByEmail(email)).map(token => ({
                ...token,
                notifications: [
                    ...allNotifications,
                    "BACKOFFICE_USERS:OWN_STATUS_CHANGED"
                ]
            }));
            let updateObject = {};
            tokens.forEach((token) => {
                updateObject[token.token] = token;
                admin.messaging().sendToDevice(token.token, {
                    notification: {
                        title: "Nuevo Rol Asignado",
                        body: `Se te ha asignado el rol ${afterRolDefinition.rolName}`
                    }
                })
            })
            console.log('updateObject', updateObject);
            await fcmTokens.updateFcmTokens(updateObject);
        }
    });

    return listenToRolAssign;
}