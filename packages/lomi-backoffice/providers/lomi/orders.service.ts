import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
  export class OrdersService {

    public orders: any[] = []
    public pendingOrders: any[] = []    
    public completedOrders: any[] = []

    activatedFilters:any = []

    public booleanFilters:any = [
      {
        name: "Pedidos completados",
        action: this.completedFilter
      },
    ]

    completedFilter(order:any){
      return order.hermexOrder ? order.status.id == 8 : order.journey_state == "drop off" || order.journey_state == "withdrawaled"  
    }

    doFilter(filter:any){
      this.orders = this.orders.filter(filter.action)
      this.activatedFilters.push(filter)
    }
  
    constructor(
        db: AngularFireDatabase,
        activatedRoute: ActivatedRoute,
        ) {
        const realTimeOrders = db.list('orders',(ref)=>{
          return ref.orderByChild("completed_at").limitToLast(30)
        }).valueChanges()

        realTimeOrders.subscribe((orders:any)=>{
          this.orders = orders.reverse()
          this.orders.forEach((order)=>{
            order.badges = []
            if(order.bill_address.company == "LOMI"){
              order.badges.push({ abreviation: "RT", color:"green"})
            } 
            else if(order.hermexOrder){
              console.log(order)
              order.badges.push({ abreviation: "Hmx", color:"teal"})
            }
            else if(order.journey_state){
              order.badges.push({ abreviation: "CAB", color:"purple"})
            } 
          })
          console.log(this.orders)
        })
    }

    getOrderByNumber(orderNumber:string){
      return this.orders.find((order)=>{
          return order?.number == orderNumber
      })   
     }
  }
  