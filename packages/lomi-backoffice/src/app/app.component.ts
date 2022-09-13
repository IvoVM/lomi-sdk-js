import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/app.actions';
import { OrdersService } from '../../providers/lomi/orders.service';
import { getMessaging } from "firebase/messaging";
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { take } from 'rxjs';
import { UserService } from './providers/user.service';

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
    private angularFireMessaging: AngularFireMessaging,
    private userService: UserService,
    ){
      this.requestMessagingPermission();
      this.store.dispatch(new Query())
      this.store.select('user').subscribe((user:any)=>{
        this.userId = user.uid
      })

    }
    
    private requestMessagingPermission(){
      this.angularFireMessaging.requestToken.subscribe((token) => {
        console.log(token);
        if(token){
          this.userService.addUserToken(this.userId,token)
        }
      })
      this.angularFireMessaging.requestPermission.subscribe(
        (token) => {
          console.log(token);
          this.angularFireMessaging.messages.subscribe((message) => {
            console.log(message);
          });
        }
      );
    }

  title = 'lomi-material';
}
