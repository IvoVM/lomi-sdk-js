import { Component, OnInit, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';

@Component({
  selector: 'lomii-delivery-operator-selector',
  templateUrl: './delivery-operator-selector.component.html',
  styleUrls: ['./delivery-operator-selector.component.scss'],
})
export class DeliveryOperatorSelectorComponent implements OnInit {
  public operators = [
    {
      name: "Cabify",
      icon: "cabify.png",
      trips : (order:any)=> {
        if(!order.cabifyEstimated){
          return [{}]
        }

        order.cabifyEstimated.map((cabifyEstimated:any)=>{
          cabifyEstimated.duration_display = Math.round(cabifyEstimated.duration / 60)
          cabifyEstimated.eta_display = cabifyEstimated.eta?.formatted
          cabifyEstimated.cost_display = cabifyEstimated.priceBase.amount
          cabifyEstimated.product_type = cabifyEstimated.product.name.es
          cabifyEstimated.deliveryTime_display = Math.round((cabifyEstimated.eta.max + cabifyEstimated.duration) / 60)
        })
        return order.cabifyEstimated
      },
    },
    {
      name: "Uber",
      icon: "uber.png",
      trips : (order:any)=>{
        if(!order.uberEstimated){
          return [{}]
        }

        const uberEstimated = order.uberEstimated
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
       order.hermexEstimated = !order.hermexEstimated ? {
          duration_display: order.cabifyEstimated ? order.cabifyEstimated[0].duration_display : order.uberEstimated? order.uberEstimated.duration_display : null,
        } : order.hermexEstimated
        const hermexEstimated = order.hermexEstimated
        return [hermexEstimated]
      }
    }
  ]
  public selectedOperator = ""


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public order: any,
    private _orders: OrdersService,
    ) {

  }

  selectOperator(){
    console.log(this.selectedOperator)
    const order = this.order
    order.line_items = order.line_items.map((lineItem:any)=>{
      return {
        quantity: lineItem.quantity,
        name: lineItem.name
      }
    })
    switch(this.selectedOperator){
      case "Uber": this._orders.createUberTrip(order); break;
    }
  }
  
  ngOnInit(): void {
    console.log(this.order)
  }
}
