
const RESOURCES_DOCUMENT_PATH = "backoffice-app/resources";
const STORES_RESOURCE_TYPE = "SPREE_STOCK_LOCATION";

module.exports = (admin) => {
    const firebaseUtils = require("./firebase")(admin);
    
    const getResourcesDocument = async () => {
        return firebaseUtils.getFirebaseDocument(RESOURCES_DOCUMENT_PATH);
    }

    const convertObjectToArrayAndfilterResourcesByType = async (collectionType) => {
        const resources = Object.values(await getResourcesDocument());
        return resources.filter((resource) => resource.type == collectionType);
    };

    const getResourcesCollectionStockLocations = async () => {
        return convertObjectToArrayAndfilterResourcesByType(STORES_RESOURCE_TYPE);
    };

    const getStockLocationResourceById = async (stockLocationId) => {
        const resources = await getResourcesDocument()
        return resources["SPREE_ORDERS_"+stockLocationId];
    };

    return {
        getResourcesDocument,
        getResourcesCollectionStockLocations,
        getStockLocationResource : getStockLocationResourceById
    }
}