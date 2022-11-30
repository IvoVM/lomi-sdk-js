const uberDispatcher = require('./uber')(
  'ydQvqFF87tXeoLqlzGeFCT5LDLLzXrKl',
  'M8AEI2Qf023-NlvXDIaZu6PUZTBRoS95c8Atdm1N',
  '2648bc3d-7ebe-4154-a42e-c2dfe94a0075'
);
const uberDebugDispatcher = require('./uber')(
  'knJa-FrOl2QHzkcnoG3gnWsj0VqXbVme',
  'uze9hsr1-89pgi-7zRohC0f3RIJDBReMtI5caWJn',
  'ba030355-7cc4-4922-98a1-0c706aced46e'
);
const uberFourWheelsDispatcher = require('./uber')(
  '12DtgZG9GdP01Pwj4F5I60O5PU-jH-lE',
  'U4BjK7MnhLIAfixrkePc8A89VrKWHS7mccX2fitt',
  '3bc20eef-481a-4942-94f1-ecb5a15ddd6e',
);
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
    if(uberEstimated.kind && uberEstimated.kind == 'error'){
      console.log(uberEstimated.message)
      return
    }
    quoteId = uberEstimated.id
    console.log(uberEstimated, quoteId)
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