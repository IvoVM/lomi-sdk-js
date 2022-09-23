import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import {  BackofficeState, selectState0 } from 'packages/lomi-backoffice/ngrx';
import { selectAll } from 'packages/lomi-backoffice/ngrx/reducers/orders.reducer';
import { ON_PICKING_STATE, PENDING_STATE, WAITING_AT_DRIVER_STATE, SCHEDULED_STATE } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { Journey, OnPickingOrder, Order, PendingOrder } from 'packages/lomi-backoffice/types/orders';
import { DeliveryOperatorSelectorComponent } from '../components/delivery-operator-selector/delivery-operator-selector.component';
import { PickerSelectComponent } from '../picker-select/picker-select.component';
import * as OrderStates from '../../providers/lomi/mocks/states.mock';
import { Timestamp } from 'firebase/firestore';
import { EntityState } from '@ngrx/entity';
import { ConfirmModalComponent } from 'packages/lomi-backoffice/shared/components/modals/confirm-modal/confirm-modal.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
@Component({
  selector: 'lomii-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  public secondsToWarning = 24 * 60 * 60;
  public secondsToAlert = 7 * 60 * 60;
  public orderStates = OrderStates
  public columnsToDisplay = ['number','name', 'completed_at','actions', 'cabify_estimated'];
  public commonColumns = ['name'];
  public journeys: EntityState<Journey> = {
    entities: {},
    ids: []
  };
  checkedSlide!: boolean

  @Input() state:any = null;
  @Output() recordsFetched = new EventEmitter<number>();

  componentOrders:any = []

  
  constructor(
    public ordersProvider:OrdersService,
    private _bottomSheet: MatBottomSheet,
    private store: Store<BackofficeState>,
    ) {
      
    }

    get currentTime(){
      return new Date().getTime()
    }

  showItems(orderId:string){
    window.open('https://lomi.cl/admin/orders/'+orderId+'/invoice', "_blank")
    this.ordersProvider.updateOrder(orderId, {
      status: PENDING_STATE
    })
    this.ordersProvider.currentStep++
  }

  pickOrder(order:Order){
    this.ordersProvider.updateOrder(order.number, {
      status: WAITING_AT_DRIVER_STATE
    })
    this.ordersProvider.setCabifyEstimated(order)
    this.ordersProvider.setUberEstimated(order)
    this.ordersProvider.currentStep++  
  }

  completeOrder(order:Order){
    this.checkedSlide = true
    this._bottomSheet.open(ConfirmModalComponent, {
      data: { title: `¿Fué retirado el pedido por ${order.email}?` }
    }).afterDismissed().subscribe((response) => {
      if (response.result === 'confirm') {
        this._bottomSheet.open(PickerSelectComponent,{
          data: {orderNumber: order.number, stockLocation: order.shipment_stock_location_id, buttonText: 'y completar'}
        }).afterDismissed().subscribe((picker)=>{
          if(picker){
            this.ordersProvider.updateOrder(order.number, {
              status: OrderStates.FINISHED_STATE
            })
            this.ordersProvider.currentStep = OrderStates.FINISHED_STATE
          } else this.checkedSlide = false 
        })
      } else this.checkedSlide = false
    })

  }

  selectPicker(order:PendingOrder){
    this._bottomSheet.open(PickerSelectComponent,{
      data: { orderNumber: order.number, stockLocation: order.shipment_stock_location_id, buttonText: 'e iniciar' }
    }).afterDismissed().subscribe((picker)=>{
      if(picker){
        this.ordersProvider.updateOrder(order.number, {
          status: ON_PICKING_STATE
        })
        this.ordersProvider.currentStep++
      }
    })
  }

  createTrip(order:any){
    this._bottomSheet.open(DeliveryOperatorSelectorComponent, {
      data: order
    })
  }

  get actionIcon(){
    switch(this.state){
      case SCHEDULED_STATE: return 'person_add'
      case PENDING_STATE: return 'person_add'
      case ON_PICKING_STATE: return 'arrow_forward_ios'
      case WAITING_AT_DRIVER_STATE: return 'local_shipping'
      case OrderStates.STORE_PICKING_STATE: return 'slide-toggle'
    }
    return 'shopping_cart'
  }

  actionFunction(order:Order){
    console.log(order)
    switch(this.state){
      case SCHEDULED_STATE: return this.selectPicker(order)
      case PENDING_STATE: return this.selectPicker(order)
      case ON_PICKING_STATE: return this.pickOrder(order)
      case WAITING_AT_DRIVER_STATE: return this.createTrip(order)
      case OrderStates.STORE_PICKING_STATE: return this.completeOrder(order)
    }
    console.log(this.state,"state",)
    return this.showItems
  }

  get actions(){
    switch(this.state){
      case SCHEDULED_STATE: return ['selectPicker']
      case PENDING_STATE: return ['selectPicker']
      case ON_PICKING_STATE: return ['pickOrder']
      case WAITING_AT_DRIVER_STATE: return ['createTrip']
      case OrderStates.STORE_PICKING_STATE: return ['completeOrder']
    }
    return []
  }

  getJourneys(){
    this.store.select("journeys").subscribe((journeys:EntityState<Journey>)=>{
      this.journeys = journeys
    })
  }

  getJourneyByOrderNumber(orderNumber:string){
    return Object.values(this.journeys.entities).find((journey:any)=>{
      return journey.orderNumber == orderNumber
    })
  }


  ngOnInit(): void {
    console.log(this.state,"state")
    if (this.state != OrderStates.WAITING_AT_DRIVER_STATE) this.columnsToDisplay.pop()
    if(this.state == OrderStates.DELIVERING_ORDER_STATE){
      this.getJourneys()
      this.columnsToDisplay.push("state")
    }
    if (this.state == OrderStates.SCHEDULED_STATE) {
      this.columnsToDisplay = ['number','name', 'completed_at','scheduled_at' ,'actions',]
    }
    if(this.state == undefined){
      this.columnsToDisplay = ["number","name","completed_at","state"]
    }

    this.getJourneys()
    
    const selector = selectState0(this.state)
    this.store.pipe(
      selector
    ).subscribe((orders)=>{
      if(orders){
        this.componentOrders = orders
        this.componentOrders.forEach((order:Order)=>{
          // if (order.scheduled_at && !order.status) {
          //   this.ordersProvider.updateOrder(
          //     order.number, 
          //     {
          //       status: 1
          //     }, 
          //     order.shipment_stock_location_id)
          // }
          if(order && !order.completed_at?.seconds){
            this.ordersProvider.updateOrder(
            order.number, 
            {
              completed_at: Timestamp.fromDate(new Date(order.completed_at as any))
            }, 
            order.shipment_stock_location_id)
          }
        })
        this.recordsFetched.emit(orders.length)
      }
    })
  }
}
