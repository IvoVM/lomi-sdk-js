module.exports = (admin) => {
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
        updateFcmTokens
    }
}