module.exports = (admin) => {
    const getFirebaseCollection = async (collectionName) => {
        const collectionRef = admin.firestore().collection(collectionName);
        const collection = await collectionRef.get();
        return collection.docs.map(doc => doc.data());
    };

    const getFirebaseDocument = async (documentName) => {
        const documentRef = admin.firestore().doc(documentName);
        const document = await documentRef.get();
        return document.data();
    };

    return {
        getFirebaseCollection,
        getFirebaseDocument
    }
};