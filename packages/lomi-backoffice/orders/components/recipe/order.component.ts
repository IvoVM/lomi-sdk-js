import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { collection } from 'firebase/firestore';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { ON_PICKING_STATE, WAITING_AT_DRIVER_STATE } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
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
  public cancelingJourney = false;

  public storeUnsubscribe:Unsubscribable | null = null;
  
  constructor( 
    public activatedRoute:ActivatedRoute,
    public ordersProvider:OrdersService,
    public store:Store<BackofficeState>,
    private router: Router,

    //BAD PRACTICE SHOULD BE SYNCED IN JOURNEYS STORE
    public afs: Firestore,
    ){

    }

    cancelHermex(hmxTripId:any){
      console.log(hmxTripId)
      this.ordersProvider.cancelHermexTrip({
        ...this.order,
        journeyId: hmxTripId
      }).subscribe((response:any)=>{
        console.log(response)
      })
    }
    
    evalType(value:any, typeName:string){
      if(typeName == 'array'){
        return value?.length
      }
      return typeof value == typeName
    }

    cancelUber(tripId:string){
      this.cancelingJourney = true;
      this.ordersProvider.cancelUberTrip(tripId).subscribe((response:any)=>{
        if(this.order){
          this.ordersProvider.updateOrder(this.order.number, {
            status: WAITING_AT_DRIVER_STATE
          })
          this.order.status = WAITING_AT_DRIVER_STATE
          const journeyIndex = this.order.journeys?.findIndex((journey:any)=>{
            return journey.uberTrip.id == tripId
          })
          if(this.order && this.order.journeys && journeyIndex){
            this.order.journeys[journeyIndex].status = response.status
            this.order.journeys[journeyIndex].uberTrip = response
            this.router.navigateByUrl("/orders#"+WAITING_AT_DRIVER_STATE)
          }
        }
      })
    }

    cancelFourWheelsUber(tripId:string){
      this.cancelingJourney = true;
      this.ordersProvider.cancelUberTrip(tripId).subscribe((response:any)=>{
        if(this.order){
          this.ordersProvider.updateOrder(this.order.number, {
            status: WAITING_AT_DRIVER_STATE
          })
          this.order.status = WAITING_AT_DRIVER_STATE
          const journeyIndex = this.order.journeys?.findIndex((journey:any)=>{
            return journey.uberTrip.id == tripId
          })
          if(this.order && this.order.journeys && journeyIndex){
            this.order.journeys[journeyIndex].status = response.status
            this.order.journeys[journeyIndex].uberTrip = response
            this.router.navigateByUrl("/orders#"+WAITING_AT_DRIVER_STATE)
          }
        }
      })
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
