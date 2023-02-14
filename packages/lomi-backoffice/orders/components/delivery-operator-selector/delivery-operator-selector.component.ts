import { Component, OnInit, Inject} from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WAITING_AT_DRIVER_STATE, DELIVERING_ORDER_STATE } from '../../../providers/lomi/mocks/states.mock';
import { OrdersService } from '../../../providers/lomi/orders.service';

@Component({
  selector: 'lomii-delivery-operator-selector',
  templateUrl: './delivery-operator-selector.component.html',
  styleUrls: ['./delivery-operator-selector.component.scss'],
})
export class DeliveryOperatorSelectorComponent implements OnInit {
  public trips:any = []
  public requestingOperator = false;
  public operators = [
    {
      name: "Cabify moto",
      icon: "cabify.png",
      trips : (order:any)=> {
        if(!order.cabifyEstimated){
          return [{}]
        }
        if(order.cabifyEstimated.errors){
          return [{
            operator_name: "Cabify Moto",
            kind:"error",
            error: order.cabifyEstimated.errors[0].friendly_message
          }]
        }
        console.log(order.cabifyEstimated)
        
        return order.cabifyEstimated.data?.estimates ? order.cabifyEstimated.data.estimates.map((cabifyEstimated:any)=>{
          const duration_display = Math.round(cabifyEstimated.duration / 60)
          const eta_display = cabifyEstimated.eta?.formatted
          const cost_display = cabifyEstimated.priceBase.amount
          const product_type = cabifyEstimated.product.name.es
          const product_id = cabifyEstimated.product.id
          const deliveryTime_display = Math.round((cabifyEstimated.eta.max + cabifyEstimated.duration) / 60)
          return {
            duration_display, eta_display, cost_display, product_type, deliveryTime_display, product_id
          }
        }) : [{
          eta_display: order.cabifyEstimated.eta_to_pick_up * 1000,
          duration_display: order.cabifyEstimated.eta_to_delivery * 1000,
          deliveryTime_display: ((order.cabifyEstimated.eta_to_delivery + order.cabifyEstimated.eta_to_pick_up )* 1000),
          cost_display: order.cabifyEstimated.price_total.amount,
          product_type: "Cabify moto",
          product_id: "cabify_moto"
        }]
      },
    },
    {
      name: "Cabify auto",
      icon: "cabify.png",
      trips : (order:any)=> {
        if(!order.cabifyEstimated){
          return [{}]
        }
        if(order.cabifyEstimated.errors){
          return [{
            operator_name: "Cabify Auto",
            kind:"error",
            error: order.cabifyEstimated.errors[0].friendly_message
          }]
        }
        console.log(order.cabifyEstimated)
        
        return order.cabifyEstimated.data?.estimates ? order.cabifyEstimated.data.estimates.map((cabifyEstimated:any)=>{
          const duration_display = cabifyEstimated.duration * 1000
          const eta_display = cabifyEstimated.eta?.formatted
          const cost_display = cabifyEstimated.priceBase.amount
          const product_type = cabifyEstimated.product.name.es
          const product_id = cabifyEstimated.product.id
          const deliveryTime_display = (cabifyEstimated.eta.max + cabifyEstimated.duration) * 1000
          return {
            duration_display, eta_display, cost_display, product_type, deliveryTime_display, product_id
          }
        }) : [{
          eta_display: (order.cabifyEstimated.eta_to_pick_up* 1000),
          duration_display: (order.cabifyEstimated.eta_to_delivery * 1000),
          deliveryTime_display: ((order.cabifyEstimated.eta_to_delivery + order.cabifyEstimated.eta_to_pick_up )* 1000),
          cost_display: order.cabifyEstimated.price_total.amount,
          product_type: "Cabify",
          product_id: "cabify_auto"
        }]
      },
    },
    {
      name: "Uber Moto",
      icon: "uber.png",
      trips : (order:any)=>{
        if(!order.uberEstimated){
          return [{}]
        }

        const uberEstimated = {...order.uberEstimated}
        uberEstimated.operator_name = "Uber Moto"
        uberEstimated.duration_display = (uberEstimated.duration - uberEstimated.pickup_duration)* 60 * 1000,
        uberEstimated.eta_display = uberEstimated.pickup_duration * 60 * 1000,
        uberEstimated.cost_display = uberEstimated.fee / 100
        uberEstimated.deliveryTime_display = uberEstimated.duration * 60 * 1000
        return uberEstimated ? [uberEstimated] : [{}]
      }
    },
    {
      name: "Uber Auto",
      icon: "uber.png",
      trips : (order:any)=>{
        if(!order.uberFourWheelsEstimated){
          return [{}]
        }

        const uberEstimated = {...order.uberFourWheelsEstimated}
        uberEstimated.operator_name = "Uber Auto"
        uberEstimated.duration_display = (uberEstimated.duration - uberEstimated.pickup_duration) * 60 * 1000,
        uberEstimated.eta_display = uberEstimated.pickup_duration * 60 * 1000,
        uberEstimated.cost_display = uberEstimated.fee / 100
        uberEstimated.deliveryTime_display = uberEstimated.duration * 60 * 1000
        return uberEstimated ? [uberEstimated] : [{}]
      }
    }
  ]
  public selectedOperator:any = ""


  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DeliveryOperatorSelectorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public order: any,
    private _orders: OrdersService,
    private snackBar : MatSnackBar
    ) {
      this.trips = []
      const permitedStockLocations = ["1", "24", "25", "27", "28"]
      this.operators.forEach((operator:any)=>{
        this.trips = this.trips.concat(...operator.trips(order).map((trip:any)=>({...trip, operator: operator.name, icon: operator.icon})))
      })
      const stockLocationId = localStorage.getItem("stockLocationId")
      console.log(stockLocationId)
      if(stockLocationId && !permitedStockLocations.includes(stockLocationId)){
        this.trips = this.trips.slice(1,3)
      }
  }

  selectOperator(productId:any = null){
    console.log(this.selectedOperator, productId)
    const order = {...this.order}
    const selectedTrip = this.trips[this.selectedOperator]    
    order.line_items = order.line_items.map((lineItem:any)=>{
      return {
        quantity: lineItem.quantity,
        name: lineItem.name,
        price: parseInt(lineItem.price)   
      }
    })
    //order.store_notes = storesMock[order.shipment_stock_location_id].notes ? storesMock[order.shipment_stock_location_id].notes : ''
    this.requestingOperator = true;
    switch(selectedTrip.operator){
      case "Uber Moto": this._orders.createUberTrip({...order}).subscribe(
        this.listenForOperator,
        (err)=>{
          console.log(err)
          this.snackBar.open("No se pudo solicitar el viaje, intente nuevamente");
          this.requestingOperator = false;
        }
        ); break;
      case "Uber Auto": this._orders.createFourWheelsUberTrip({...order}).subscribe(
        this.listenForOperator,
        (err)=>{
          console.log(err)
          this.snackBar.open("No se pudo solicitar el viaje, intente nuevamente");
          this.requestingOperator = false;
        }
        ); break;
      case "Cabify moto": this._orders.createCabifyTrip({...order, vehicleType: "2W"}).subscribe(
        this.listenForOperator,
        (err)=>{
          console.log(err)
          this.snackBar.open("No se pudo solicitar el viaje, intente nuevamente");
          this.requestingOperator = false;
        }
      ); break;
      case "Cabify auto": this._orders.createCabifyTrip({...order, vehicleType: "4W" }).subscribe(
        this.listenForOperator,
        (err)=>{
          console.log(err)
          this.snackBar.open("No se pudo solicitar el viaje, intente nuevamente");
          this.requestingOperator = false;
        }
      ); break;
    }
  }

  listenForOperator = (order:any) => {
    this._orders.currentStep = DELIVERING_ORDER_STATE
    this._bottomSheetRef.dismiss(order)
    this.snackBar.open("Viaje solicitado con exito");
    if(order.status == WAITING_AT_DRIVER_STATE){
      //this._orders.currentStep = WAITING_AT_DRIVER_STATE
    } else {
      this.requestingOperator = false
    }
  }
  
  ngOnInit(): void {
    console.log(this.order)
  }
}
