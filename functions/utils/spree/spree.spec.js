const spreeUrl = "https://lomi-dev.herokuapp.com/";
const token = "8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3";
const orderNumber = "R807351112";

const admin = require('firebase-admin');
admin.initializeApp()

const spree = require('./spree')(spreeUrl, token, admin);

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
    console.log(zones);
});