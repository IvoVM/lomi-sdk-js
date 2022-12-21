const admin = require('firebase-admin');
admin.initializeApp();
const firebaseLomiUtils = require('./resources')(admin);
jest.setTimeout(1000000)

test('Should get Las condes Resource of store', async() => {
    const stockLocationId = "Las Condes";
    const stockLocationResource = await firebaseLomiUtils.getStockLocationResource("1");
    expect(stockLocationResource).toEqual("SPREE_ORDERS_1");
})