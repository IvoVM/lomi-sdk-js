import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { hits } from 'instantsearch.js/es/widgets';
import { Observable, of, Subject } from 'rxjs';

const searchClient = algoliasearch(
  'R7PUY5XVQS',
  'a2c0594de862699edc3960c307f302e2'
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

  public search(queryString:any, indexName = 'name'){
    if(!queryString){
      this.hitsSubject.next([])
      return
    }

    const currentStockLocation = localStorage.getItem('stockLocationId')
    const userRol = localStorage.getItem('userRol')
    
    console.log("currentStockLocation", currentStockLocation, "userRol", userRol)
    
    const query = {
      indexName,
      query: queryString,
      params: {
        hitsPerPage: 20,
        filters: userRol === '1' ? '' : `shipment_stock_location_id:${currentStockLocation}`
      }
    }

    searchClient.search([query]).then(({results}) => {
      const { hits } = results[0];
      this.hitsSubject.next(hits)
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
