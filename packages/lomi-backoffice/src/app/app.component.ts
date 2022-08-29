import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/app.actions';
import { OrdersService } from '../../providers/lomi/orders.service';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public userId:any = 0;

  constructor(
    public orders:OrdersService,
    public store:Store<BackofficeState>,
    public router: Router,
    ){
      this.store.dispatch(new Query())
      this.store.select('user').subscribe((user:any)=>{
        this.userId = user.uid
      })
  }

  title = 'lomi-material';
}
