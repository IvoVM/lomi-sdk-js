
const { app , sendOrderDetails} = require('./slack')
const order = require('./utils/mocks/order')

it('should send a slack message with the order details', ()=>{
    sendOrderDetails(order)
})