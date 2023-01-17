
const order = require('./utils/mocks/order');
const CabifyDispatcher = require("./cabify")
const productId = "a5bb14a1509b2a1c4f1bc21b788a86b3"
let journeyId = "44f12314-718c-11ed-b7e3-1ebd6b1bb38f"
let userEmail = "marco@lomi.cl"
const parcelIds = ["f32a2fdf-d763-43de-8be4-4e19822a1bb4"]

test("Estimate cabify trip", async() => {
    await CabifyDispatcher.authCabify()
    const cabifyEstimated = await CabifyDispatcher.estimateCabify(order);
    console.log(cabifyEstimated)


    //                   RESPONSE
    /**
     *  
     *  {
            price_total: { amount: 6732, currency: 'CLP' },
            eta_to_pick_up: 360,
            eta_to_delivery: 3180
        }
     */
    /** {
      parcels: [
        {
          id: 'f32a2fdf-d763-43de-8be4-4e19822a1bb4',
          client_id: '2507c012819d9837fa3b15ca88c0ada1',
          deliver_from: '1970-01-01T00:00:00Z',
          deliver_to: '1970-01-01T00:00:00Z',
          dimensions: [Object],
          dropoff_info: [Object],
          external_id: 'R266577403',
          pickup_info: [Object],
          state: 'ready',
          weight: [Object]
        }
      ]
    } */
})

test('Create cabify trip', async () => {
    //not runned because it will create a trip
    return
    await CabifyDispatcher.authCabify()
    const cabifyTrip = await CabifyDispatcher.createCabifyTrip(order, productId);
    console.log(cabifyTrip.data.deliveries)
    //const journeyId = cabifyTrip.data.data.createJourney.id
    //const cancelTrip = await CabifyDispatcher.cancelCabifyTrip(journeyId);
    //console.log(cancelTrip)
})

test('Cancel cabify trip', async() => {
    const cabifyTrip = await CabifyDispatcher.cancelCabifyTrip(journeyId);
    console.log(cabifyTrip)
})

test('Get Cabify user', async() => {
    await CabifyDispatcher.authCabify()
    const cabifyUser = await CabifyDispatcher.getUser(userEmail);
    console.log(cabifyUser.data.user)
})

test('Get cabify trip', async() => {
    await CabifyDispatcher.authCabify()
    const cabifyTrip = await CabifyDispatcher.getCabifyTrip(journeyId);
    console.log(cabifyTrip.data.journey.state)
})