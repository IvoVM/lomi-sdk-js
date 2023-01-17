const spreeUrl = "https://lomi.cl/";
const spreeDebugUrl = "https://lomi-dev.herokuapp.com/";
const token = "8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3";
const orderNumber = "R097683121";
const JourneyId = "225254"

const admin = require('firebase-admin');
admin.initializeApp()

const spree = require('./spree')(spreeUrl, token, spreeDebugUrl);

test("get Order", async () => {
    let order = await spree.getOrder(orderNumber).then(res => res, err => {
        console.error(err.response.data);
        if(err.response.status == 404){
            console.log("Debug ordert")
        }
        throw (err)
    });
    if(order == "broken"){
        order = await spree.getDebugOrder(orderNumber).then(res => res, err => {})
        order.DEBUG = true;
    }
    console.log(order)
})

test('create journey', async() => {
    
})

test('get Journeys', async () => {
    const journeys = await spree.getJourneys(JourneyId).then(res => res, err => {
        console.error(err.response.data);
        throw (err)
    });
    journeys.forEach(element => {
        console.log(element.id)
    });
})

test("get Shipments", async () => {
    const shipments = await spree.getShipments(orderNumber).then(res => res, err => {
        console.error(err.response.data);
        throw (err)
    });
    console.log(shipments);
    shipmentId = shipments[0].number;
})

test("Mark Shipment as Ready", async () => {
    const shipment = await spree.markShipmentAsReady(shipmentId).then(res => res, err => {
        console.error(err.response.data);
        throw (err)
    });
    console.log(shipment);
})

test("Mark Shipment as Shipped", async () => {
    const shipment = await spree.markShipmentAsShipped(shipmentId).then(res => res, err => {
        console.error(err.response.data);
        throw (err)
    });
    console.log(shipment);
})

test("Get Stock locations", async () => {
    const zones = await spree.getStockLocations().then(res => res, err => {
        console.error(err.response.data);
        throw (err)
    });
    console.log(zones.stock_locations);
});