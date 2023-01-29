module.exports = (admin) => {
    const getFirebaseCollection = async (collectionName, limit = false) => {
        let collectionRef = admin.firestore().collection(collectionName, limit = false);
        const collection = await collectionRef
        .orderBy('completed_at','desc')
        .limit(100)
        .get();
        console.log("Getting collection with name: ", collectionName, "and size:", collection.size)
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