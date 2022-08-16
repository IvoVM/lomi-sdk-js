import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { DeliveryOperatorSelectorComponent } from '../components/delivery-operator-selector/delivery-operator-selector.component';

@Component({
  selector: 'lomii-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  public columnsToDisplay = ['number','name', 'completed_at', 'state','actions', 'cabify_estimated'];
  public commonColumns = ['name'];

  @Input() state:any = null;

  componentOrders = []

  constructor(
    public ordersProvider:OrdersService,
    private _bottomSheet: MatBottomSheet
  ) {
  }

  showItems(orderId:string){
    window.open('https://lomi.cl/admin/orders/'+orderId+'/invoice', "_blank")
    this.ordersProvider.updateOrder(orderId, {
      state: "Preparando pedido"
    })
    this.ordersProvider.currentStep++
  }

  pickOrder(order:any){
    this.ordersProvider.updateOrder(order.number, {
      state: "Listo para el despacho"
    })
    this.ordersProvider.setCabifyEstimated(order)
    this.ordersProvider.setUberEstimated(order)
    this.ordersProvider.currentStep++  
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
    if(this.state){
      this.ordersProvider.orders$.subscribe((orders:any)=>{
        this.componentOrders = orders.filter((order:any)=>this.stateName(order.state) == this.state)
      })
    }
  }
}
