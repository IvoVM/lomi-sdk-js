import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
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
    public store:Store<BackofficeState>
    ){
      this.store.select('user').subscribe((user:any)=>{
        this.userId = user.uid
      })
  }

  title = 'lomi-material';
}
