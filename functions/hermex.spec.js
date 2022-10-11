const HmxDispatcher = require('./hermex');

const orderId = "15696";

test('Get Hermex Status', async () => {
    const orderStatus = await HmxDispatcher.getOrderStatus('15696');
    console.log(orderStatus.data.data.status)
})

test('Cancel Trip', async () => {
    const orderStatus = await HmxDispatcher.cancelTrip('15696');
    console.log(orderStatus.data)
})