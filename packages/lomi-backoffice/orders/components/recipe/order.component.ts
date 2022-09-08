import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { collection } from 'firebase/firestore';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Order } from 'packages/lomi-backoffice/types/orders';
import { take, Unsubscribable } from 'rxjs';
import { OrdersService } from '../../../providers/lomi/orders.service';


@Component({
  selector: 'lomi-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;
  
  public order:Order | undefined;

  public storeUnsubscribe:Unsubscribable | null = null;
  
  constructor( 
    public activatedRoute:ActivatedRoute,
    public ordersProvider:OrdersService,
    public store:Store<BackofficeState>,

    //BAD PRACTICE SHOULD BE SYNCED IN JOURNEYS STORE
    public afs: Firestore,
    ){

    }
    
    evalType(value:any, typeName:string){
      if(typeName == 'array'){
        return value?.length
      }
      return typeof value == typeName
    }
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(async (params:any)=>{
        const orderNumber = params.number
        this.storeUnsubscribe?.unsubscribe ? this.storeUnsubscribe.unsubscribe() : null
        this.storeUnsubscribe = this.store.select("orders").subscribe((state)=>{
          this.order = Object.values(state.entities).find((order:any)=>order.number == orderNumber)
          if(this.order){
            const orderJourneysCollection = collection(this.afs,`SPREE_ORDERS_${this.order?.shipment_stock_location_id}/${this.order.number}/journeys`)
            const orderJourneysObservable = collectionData(orderJourneysCollection)
            orderJourneysObservable.pipe(take(1)).subscribe((journeys:any)=>{
              if(this.order && journeys.length){
                this.order.journeys = journeys
              }
            })
          }
          console.log(this.order)
        })
    })
  }
}
