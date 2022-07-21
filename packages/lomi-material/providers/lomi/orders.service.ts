import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class OrdersService {

    public orders: any[] = []
    public pendingOrders: any[] = []    
    public completedOrders: any[] = []

    public loadingOrders = true;

    private ordersRef
    private orders$

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
        private firestore: Firestore
        ) {
        this.ordersRef = collection(this.firestore, 'SPREE_ORDERS_1');
        this.orders$ = collectionData(this.ordersRef) as Observable<any[]>
        this.orders$.subscribe((orders)=>{
          orders.reverse()
          this.orders.forEach((order)=>{
            order.badges = []
            if(order.name.includes("Retiro en")){
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
        })
    }

    getOrderByNumber(orderNumber:string){
      console.log(this.orders)
      return this.orders.find((order)=>{
          return order.number == orderNumber
      })   
     }
  }
  