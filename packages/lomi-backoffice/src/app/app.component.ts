import { Component } from '@angular/core';
import { AuthService } from '../../providers/lomi/auth.service';
import { ChatAdapter } from 'ng-chat';
import { DemoAdapter } from './demo-adapter';
import { OrdersService } from '../../providers/lomi/orders.service';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public userId:any = 0;
  public adapter: ChatAdapter = new DemoAdapter();

  constructor(
    public auth:AuthService,
    public orders:OrdersService,
    ){

  }

  title = 'lomi-material';
}
