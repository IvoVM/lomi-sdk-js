import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Logout } from 'packages/lomi-backoffice/ngrx/actions/user.actions';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { IUser } from 'packages/lomi-backoffice/types/user';

@Component({
  selector: 'lomii-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {

  public journeys:any = []
  public journeysUnsubscribable:any;
  public ordersSubscription:any;
  public cabifyNear = false;
  public deliveringOrders: any[] = [];

  public user:IUser = {
    uid: "",
    email:'',
    userRol: 0,

  };

  public routes = [
    {
      route: "orders",
      name: "Pedidos",
    },
    {
      route: "orders-history",
      name: "Historial de pedidos",
    },
    {
      route: "users",
      name: "Usuarios",
    },
    {
      route: "stock",
      name: "Productos"
    }
  ]

  constructor(
    private store:Store<BackofficeState>,
    public orders:OrdersService,
    public router: Router,
  ) {
    this.store.select(
      currentUserSelector
    ).subscribe((user:any)=>{
      this.user = user
      if(!this.user.userRol){
        this.routes = []
      } else {
        this.routes = [
          {
            route: "orders",
            name: "Pedidos",
          },
          {
            route: "orders-history",
            name: "Historial de pedidos",
          },
          {
            route: "stock",
            name: "Stock"
          }
        ]
        if(this.user.userRol.toString() == "Admin"){
          this.routes.push({
            route: "users",
            name: "Usuarios",
          })
        }
      }
    })
  }

  ngOnDestroy(){
    this.journeysUnsubscribable.unsubscribe()
    this.ordersSubscription.unsubscribe()
  }

  public logout(){
    this.store.dispatch(new Logout())
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.cabifyNear = true
    }, 5000)
    this.ordersSubscription = this.store.select("orders").subscribe((orders:any)=>{
      this.deliveringOrders = Object.values(orders.entities).filter((order:any)=>order.status == 2 && !(order.scheduled_at && new Date(order.scheduled_at) > new Date()));
    })
    this.journeysUnsubscribable = this.store.select("journeys").subscribe((journeys)=>{
      this.journeys = Object.values(journeys.entities)
    })
  }
}
