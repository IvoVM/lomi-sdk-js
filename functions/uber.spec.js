const uberDispatcher = require("./uber")
const order = require("./utils/mocks/order")

let tripId = null;
let quoteId = null;

test('Create Uber Quote',async ()=>{
    const uber = await uberDispatcher.auth()
    const uberEstimated = await uberDispatcher.createQuote(
        order.ship_address_address1 +
          ', ' +
          order.ship_address_city +
          ', ' +
          order.ship_address_country,
        order.shipment_stock_location_name,
        order
      );
    quoteId = uberEstimated.id
    console.log(uberEstimated)
})

test('Create Uber Trip',async ()=>{
    const uber = await uberDispatcher.auth()
    console.log(order)
    const uberTrip = await uberDispatcher.createTrip(
        order.stops
        ? order.stops[1].loc.join(',')
        : null,
        order.name,
        "+56935103087",
        order.stops
        ? order.stops[0].loc.join(',')
        : null,
        order.shipment_stock_location_name.split('-')[1],
        "+56935103087",
        order.line_items.map(item => ({...item, size: "medium"})),
        order
      ).then(res=>res, err=>{
          console.error(err)
          throw(err)
      });
    tripId = uberTrip.id
    console.log(uberTrip)
})

test('Get Uber Trip',async ()=>{
    const uber = await uberDispatcher.auth()
    const uberTrip = await uberDispatcher.getTrip(tripId);
    console.log(uberTrip)
})

test ('Cancel Uber Trip', async ()=>{
  const uber = await uberDispatcher.auth()
  const uberTrip = await uberDispatcher.cancelTrip(tripId);
  console.log(uberTrip)
})