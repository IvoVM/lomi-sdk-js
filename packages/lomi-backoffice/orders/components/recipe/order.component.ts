import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { collection } from 'firebase/firestore';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { ON_PICKING_STATE, WAITING_AT_DRIVER_STATE } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { Order } from 'packages/lomi-backoffice/types/orders';
import { take, Unsubscribable } from 'rxjs';
import { OrdersService } from '../../../providers/lomi/orders.service';
import { DeliveryOperatorSelectorComponent } from '../delivery-operator-selector/delivery-operator-selector.component';
import {GoogleMapsAPIWrapper} from '@agm/core';
import { MatDialog } from '@angular/material/dialog';
import { EditAddressComponent } from 'packages/lomi-backoffice/shared/modals/edit-address/edit-address.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from 'packages/lomi-backoffice/providers/lomi/products.service';
import { normalizePhone } from 'packages/lomi-backoffice/shared/functions/utils';

@Component({
  selector: 'lomi-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  public normalizePhone = normalizePhone

  markerOptions = {
    origin: {
      icon: 'path-to-icon'
    },
    destination: {
      icon: 'path-to-icon'
    },
  }
  
  public order:Order | undefined;
  public cancelingJourney = false;
  public user:any;
  private userSubscription:Unsubscribable | undefined;
  private orderJourneySubscription:Unsubscribable | undefined;
  public storeUnsubscribe:Unsubscribable | null = null;
  
  constructor( 
    public activatedRoute:ActivatedRoute,
    public ordersProvider:OrdersService,
    public store:Store<BackofficeState>,
    private _bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private productsService: ProductsService,

    //BAD PRACTICE SHOULD BE SYNCED IN JOURNEYS STORE
    public afs: Firestore,
    ){

    }

    public getLineItem(lineItemId:any){
      if(this.order?.line_items_expanded){
        return { ...this.order?.line_items.find((lineItem:any)=>lineItem.id == lineItemId) , ...(this.order?.line_items_expanded.find((lineItem:any)=>lineItem.id == lineItemId)) }
      } else {
        return this.order?.line_items.find((lineItem:any)=>lineItem.id == lineItemId)
      }
    }
    returnOrder(order:any){
      this.ordersProvider.updateOrder(order.number,{
        status: 2,
        deliveredAt: new Date()
      }, order.shipment_stock_location_id
      )
      return;
    }

    completeOrder(order:any){
      this.ordersProvider.updateOrder(order.number,{
        status: 6,
        deliveredAt: new Date()
      }, order.shipment_stock_location_id
      )
      return;
    }

    createTrip(order: any) {
      this._bottomSheet.open(DeliveryOperatorSelectorComponent, {
        data: order
      })
    }

    editAddress(){
      this.dialog.open(EditAddressComponent, {
        data: this.order
      })
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

    cancelCabify(journeyId:any){
      this.cancelingJourney = true;
      this.ordersProvider.cancelCabifyTrip({
        tripId: journeyId,
        ...this.order
      }).subscribe((response:any)=>{
        this.cancelingJourney = false;
        console.log(response)
      })
    }

    cancelUber(tripId:string){
      this.cancelingJourney = true;
      this.ordersProvider.cancelUberTrip(tripId, this.order?.DEBUG).subscribe((response:any)=>{
        
        if(response.kind == 'error'){
          this.cancelingJourney = false;
          this._snackBar.open(response.message, 'Cerrar', {
            panelClass: ['red-snackbar']
          })
          return;
        } else {
          this.cancelingJourney = false;
          this._snackBar.open('Viaje cancelado', 'Cerrar', {
            panelClass: ['green-snackbar']
          })
        }

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
      this.ordersProvider.cancelUberFourWheelsTrip(tripId, this.order?.DEBUG).subscribe((response:any)=>{
        if(response.kind == 'error'){
          this.cancelingJourney = false;
          this._snackBar.open(response.message, 'Cerrar', {
            panelClass: ['red-snackbar']
          })
          return;
        } else {
          this.cancelingJourney = false;
          this._snackBar.open('Viaje cancelado', 'Cerrar',{
            panelClass: ['green-snackbar']
          })
        }
        
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

    ngOnDestroy(){
      this.userSubscription?.unsubscribe()
    }

    ngOnInit(): void {
      this.userSubscription = this.store.select("user").subscribe((user)=>{
        this.user = user
      })
      this.activatedRoute.params.subscribe(async (params:any)=>{
        const orderNumber = params.number
        this.storeUnsubscribe?.unsubscribe ? this.storeUnsubscribe.unsubscribe() : null
        this.storeUnsubscribe = this.store.select("orders").subscribe((state)=>{
          const order = Object.values(state.entities).find((order:any)=>order.number == orderNumber)
          this.order = order ? order : this.order



          if(this.order){
            const orderJourneysCollection = collection(this.afs,`SPREE_ORDERS_${this.order?.shipment_stock_location_id}/${this.order.number}/journeys`)
            const orderJourneysObservable = collectionData(orderJourneysCollection)
            if(this.orderJourneySubscription){
              this.orderJourneySubscription.unsubscribe()
            }
            this.orderJourneySubscription = orderJourneysObservable.subscribe((journeys:any)=>{
              if(this.order && journeys.length){
                this.order.journeys = journeys
              }
            })
          } else {
            this.ordersProvider.getOrder(orderNumber).then((order:any)=>{
              this.order = order.data()
              this.ngOnInit()
            })
          }
          console.log(this.order)
        })
    })
  }
}
