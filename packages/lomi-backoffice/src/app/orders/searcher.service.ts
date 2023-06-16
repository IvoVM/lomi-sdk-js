import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { hits } from 'instantsearch.js/es/widgets';
import { Observable, of, Subject } from 'rxjs';

const searchClient = algoliasearch(
  'R7PUY5XVQS',
  'a2c0594de862699edc3960c307f302e2'
);

const searchProductsClient = algoliasearch(
  '11OHOV5720',
  '2f84fbe67662bc650c7326412d888f4a'
);


@Injectable({
  providedIn: 'root'
})
export class SearcherService {

  private currentRecords: any[] = []
  public hitsSubject = new Subject<any>()
  public hitsObservable = this.hitsSubject.asObservable()
  public searchClient: any;
  public config = {
    indexName: 'name',
    searchClient
  };

  public getCurrentRecords(){
    return [...this.currentRecords]
  }
  public async searchInStock(queryString:any){
    const config = {
      indexName: 'products',
      searchProductsClient
    }
    
    return this.search(queryString, 'products', config)
  }

  public search(queryString:any, indexName = 'name', config:any = this.config){
    /**if(!queryString){
      this.hitsSubject.next([])
      return
    }**/
    const currentStockLocation = localStorage.getItem('stockLocationId')
    const storeId = parseInt(localStorage.getItem('storeId') || "")
    const query = {
      indexName,
      query: queryString,
      params: {
        hitsPerPage: 20,
        filters:
        config.indexName == 'products' ? `store_ids:${storeId}` :
         `shipment_stock_location_id:${currentStockLocation}`
      }
    }

    return (config.indexName == 'products' ? searchProductsClient : searchClient).search([query]).then(({results}) => {
      const { hits } = results[0];
      this.hitsSubject.next(hits)
      if(config.indexName == 'products'){
        const filteredHits = hits.filter((hit:any)=>{
          return hit.store_ids.find((storeId:any)=>{
            return storeId == storeId
          })
        })
        console.log(filteredHits)
        return filteredHits
      }
      return hits
    })
  }

  constructor( ) {

    this.searchClient = searchClient;

    this.hitsObservable.subscribe((hits:any)=>{
      this.currentRecords = hits
      console.log("hits", hits)
    })
  }
  
}
