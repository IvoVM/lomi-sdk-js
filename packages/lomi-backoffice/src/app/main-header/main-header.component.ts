import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Logout } from 'packages/lomi-backoffice/ngrx/actions/user.actions';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';

@Component({
  selector: 'lomii-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
  constructor(
    private store:Store,
    public orders:OrdersService
  ) {}

  public logout(){
    this.store.dispatch(new Logout())
  }

  ngOnInit(): void {}
}
