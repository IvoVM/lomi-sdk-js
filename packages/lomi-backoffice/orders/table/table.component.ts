import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import {  selectState0 } from 'packages/lomi-backoffice/ngrx';
import { selectAll } from 'packages/lomi-backoffice/ngrx/reducers/orders.reducer';
import { ON_PICKING_STATE, PENDING_STATE, WAITING_AT_DRIVER_STATE } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { OnPickingOrder, Order } from 'packages/lomi-backoffice/types/orders';
import { DeliveryOperatorSelectorComponent } from '../components/delivery-operator-selector/delivery-operator-selector.component';
import { PickerSelectComponent } from '../picker-select/picker-select.component';

@Component({
  selector: 'lomii-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  public columnsToDisplay = ['number','name', 'completed_at', 'state','actions', 'cabify_estimated'];
  public commonColumns = ['name'];

  @Input() state:any = null;

  componentOrders:any = []

  constructor(
    public ordersProvider:OrdersService,
    private _bottomSheet: MatBottomSheet,
    private store: Store,
  ) {

  }

  showItems(orderId:string){
    window.open('https://lomi.cl/admin/orders/'+orderId+'/invoice', "_blank")
    this.ordersProvider.updateOrder(orderId, {
      status: PENDING_STATE
    })
    this.ordersProvider.currentStep++
  }

  pickOrder(order:OnPickingOrder){
    this.ordersProvider.updateOrder(order.number, {
      status: WAITING_AT_DRIVER_STATE
    })
    this.ordersProvider.setCabifyEstimated(order)
    this.ordersProvider.setUberEstimated(order)
    this.ordersProvider.currentStep++  
  }

  selectPicker(order:any){
    this._bottomSheet.open(PickerSelectComponent,{
      data: order.number
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

  stateName(state:any){
    switch(state){
      case "complete": return "Confirmado"
    }
    return state
  }


  ngOnInit(): void {
    console.log(this.state,"state")
    const selector = selectState0(this.state)
    this.store.pipe(
      selector
    ).subscribe((orders)=>{
      if(orders){
        this.componentOrders = orders
      }
    })
  }
}
