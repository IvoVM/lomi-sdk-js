import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '@sentry/angular';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Logout } from 'packages/lomi-backoffice/ngrx/actions/user.actions';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';

@Component({
  selector: 'lomii-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {

  public user:User = {};

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
    })
  }

  public logout(){
    this.store.dispatch(new Logout())
  }

  ngOnInit(): void {}
}
