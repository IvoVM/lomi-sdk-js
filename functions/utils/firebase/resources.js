module.exports = (admin) => {
    const getStockLocationResource = async (stockLocationId) => {
        const resourcesDocRef = admin.firestore().doc("backoffice-app/resources");
        const resources = await resourcesDocRef.get();
        const stockLocationResource = resources.data()["SPREE_ORDERS_"+stockLocationId];
        return stockLocationResource;
    }

    return {
        getStockLocationResource
    }
}