import { catalogueModule } from './catalogue'
describe('It should fetch products from catalogue', ()=>{
    catalogueModule().getStockItems("39")
})