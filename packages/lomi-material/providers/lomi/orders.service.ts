import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Menu } from 'packages/lomi-material/types/menu';

@Injectable({
    providedIn: 'root'
  })
  export class OrdersService {

    getOrderByNumber(orderNumber:string){
     return this.orders.find((order)=>{
         return order.order.number == orderNumber
     })   
    }

    public orders: any[] = []    
  
    constructor(
        db: AngularFireDatabase,
        activatedRoute: ActivatedRoute,
        ) {
        const realTimeOrders = db.list('orders').valueChanges();

        realTimeOrders.subscribe((orders:any)=>{
          this.orders = orders[0]
          console.log(this.orders)
        })
    }
  }
  