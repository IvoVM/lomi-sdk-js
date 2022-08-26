import { Component, OnInit, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';

@Component({
  selector: 'lomii-delivery-operator-selector',
  templateUrl: './delivery-operator-selector.component.html',
  styleUrls: ['./delivery-operator-selector.component.scss'],
})
export class DeliveryOperatorSelectorComponent implements OnInit {
  public trips:any = []
  public operators = [
    {
      name: "Cabify",
      icon: "cabify.png",
      trips : (order:any)=> {
        if(!order.cabifyEstimated){
          return [{}]
        }
        return order.cabifyEstimated.map((cabifyEstimated:any)=>{
          const duration_display = Math.round(cabifyEstimated.duration / 60)
          const eta_display = cabifyEstimated.eta?.formatted
          const cost_display = cabifyEstimated.priceBase.amount
          const product_type = cabifyEstimated.product.name.es
          const deliveryTime_display = Math.round((cabifyEstimated.eta.max + cabifyEstimated.duration) / 60)
          return {
            duration_display, eta_display, cost_display, product_type, deliveryTime_display
          }
        })
      },
    },
    {
      name: "Uber",
      icon: "uber.png",
      trips : (order:any)=>{
        if(!order.uberEstimated){
          return [{}]
        }

        const uberEstimated = {...order.uberEstimated}
        uberEstimated.duration_display = uberEstimated.duration - uberEstimated.pickup_duration,
        uberEstimated.eta_display = uberEstimated.pickup_duration + " minutos",
        uberEstimated.cost_display = uberEstimated.fee
        uberEstimated.deliveryTime_display = uberEstimated.duration
        return uberEstimated ? [uberEstimated] : [{}]
      }
    },
    {
      name: "Hermex",
      icon: "hermex.png",
      trips: (order:any)=>{
       const hermexEstimated = !order.hermexEstimated ? {
          duration_display: order.cabifyEstimated ? order.cabifyEstimated[0].duration_display : order.uberEstimated? order.uberEstimated.duration_display : null,
        } : order.hermexEstimated
        return [hermexEstimated]
      }
    }
  ]
  public selectedOperator:any = ""


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public order: any,
    private _orders: OrdersService,
    ) {
      this.trips = []
      this.operators.forEach((operator:any)=>{
        this.trips = this.trips.concat(...operator.trips(order).map((trip:any)=>({...trip, operator: operator.name, icon: operator.icon})))
      })
  }

  selectOperator(){
    console.log(this.selectedOperator)
    const order = {...this.order}
    const selectedTrip = this.trips[this.selectedOperator]
    order.line_items = order.line_items.map((lineItem:any)=>{
      return {
        quantity: lineItem.quantity,
        name: lineItem.name
      }
    })
    switch(selectedTrip.operator){
      case "Uber": this._orders.createUberTrip(order); break;
    }
  }
  
  ngOnInit(): void {
    console.log(this.order)
  }
}
