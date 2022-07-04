import { Component } from '@angular/core';
import { AuthService } from '../../providers/lomi/auth.service';
import { ChatAdapter } from 'ng-chat';
import { DemoAdapter } from './demo-adapter';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public userId:any = 0;
  public adapter: ChatAdapter = new DemoAdapter();

  constructor(public auth:AuthService){

  }

  title = 'lomi-material';
}
