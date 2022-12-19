import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  async searchProducts( keyword:string ){
    const res = await axios.get("https://lomi.cl/api/v2/storefront/products?include=images%2Cvariants&keywords="+keyword+"&page=1&per_page=4&include=images,variants")
    return res.data
  }

  async getVariantByProductId(id:string){
    const res = await axios.get("https://lomi.cl/api/v2/storefront/products/"+id+"?include=images%2Cvariants")
    return res.data
  }
}
