const mockOrder = require('../utils/mocks/order')
const Algolia  = require('./algolia')

it('should save the mock order record to angolia',async ()=>{
    const record = Algolia.saveRecordToAlgolia(mockOrder)
    console.log(await record)
})