module.exports = (admin) => {

    const getOrderDocumentReference = (orderNumber, stockLocationId) => {
        const documentRef = admin.firestore().collection("SPREE_ORDERS_"+stockLocationId).doc(orderNumber);
        return documentRef;
    }

    const getFirebaseCollectionOrderedBy = async (collectionName, orderBy, limit = 100) => {
        let collectionRef = admin.firestore().collection(collectionName);
        console.log("Getting collection with limit setted to ", limit)
        const collection = await collectionRef
        .orderBy(orderBy,'desc')
        .limit(limit)
        .get();
        console.log("Getting collection with name: ", collectionName, "and size:", collection.size)
        return collection.docs.map(doc => doc.data());
    };

    const getFirebaseCollection = async (collectionName, limit = 100) => {
        let collectionRef = admin.firestore().collection(collectionName);
        console.log("Getting collection with limit setted to ", limit)
        const collection = await collectionRef
        .limit(limit)
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
        getFirebaseDocument,
        getFirebaseCollectionOrderedBy,
        getOrderDocumentReference,
    }
};