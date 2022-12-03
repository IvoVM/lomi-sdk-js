const stops = [
    {
        "addr": "Ecuador 9033, La Florida",
        "city": "Santiago",
        "contact": {
            "mobileCc": "+56",
            "mobileNum": "935103087",
            "name": "Marco"
        },
        "country": "CL",
        "loc": [
            -33.5362497,-70.5843013
        ],
        "name": "Casa Marco, La Florida",

    },
    {
        "addr": "Balmoral 309 Tienda 217, Las Condes 7550000, Región Metropolitana",
        "city": "Santiago",
        "contact": {
            "mobileCc": "+56",
            "mobileNum": "935103087",
            "name": "Marco"
        },
        "country": "CL",
        "loc": [
            -33.4059401,-70.5720341
        ],
        "name": "Tienda lomi",
    }
]
order = {
    stops: stops
}

const CabifyDispatcher = require("./cabify")
const productId = "a5bb14a1509b2a1c4f1bc21b788a86b3"
let journeyId = "44f12314-718c-11ed-b7e3-1ebd6b1bb38f"


test("Estimate cabify trip", async() => {
    await CabifyDispatcher.authCabify()
    const cabifyEstimated = await CabifyDispatcher.estimateCabify(order);
    console.log(cabifyEstimated.data.estimates)
})

test('Create cabify trip', async () => {
    await CabifyDispatcher.authCabify()
    const cabifyTrip = await CabifyDispatcher.createCabifyTrip(order, productId);
    console.log(cabifyTrip)
    console.log(cabifyTrip.data)
    const journeyId = cabifyTrip.data.data.createJourney.id
    const cancelTrip = await CabifyDispatcher.cancelCabifyTrip(journeyId);
    console.log(cancelTrip)
})

test('Cancel cabify trip', async() => {
    const cabifyTrip = await CabifyDispatcher.cancelCabifyTrip(journeyId);
    console.log(cabifyTrip)
})

test('Get cabify trip', async() => {
    await CabifyDispatcher.authCabify()
    const cabifyTrip = await CabifyDispatcher.getCabifyTrip(journeyId);
    console.log(cabifyTrip.data.journey.state)
})