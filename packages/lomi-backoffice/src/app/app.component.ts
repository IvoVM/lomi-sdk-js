import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/app.actions';
import * as fromOrders from 'packages/lomi-backoffice/ngrx/actions/orders.actions';
import { OrdersService } from '../../providers/lomi/orders.service';
import { getMessaging } from "firebase/messaging";
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { combineLatestWith, lastValueFrom, take } from 'rxjs';
import { UserService } from './providers/user.service';
import { IUser } from 'packages/lomi-backoffice/types/user';
import { App } from 'packages/lomi-backoffice/types/app';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public lastNotification:any;

  public userId:any = 0;
  public stockLocationId:any = 0;

  constructor(
    public orders:OrdersService,
    public store:Store<BackofficeState>,
    public router: Router,
    private angularFireMessaging: AngularFireMessaging,
    private userService: UserService,
    ){
      this.requestMessagingPermission();
      this.store.dispatch(new Query())
      this.store.select("user").pipe(
        combineLatestWith(
          this.store.select("app"),
      )).subscribe(async (args: [user:any, app:App])=>{
        const [user,app] = args;
        this.userId = user.uid
        if(app?.userPrivileges){
          const collectionNames = app.userPrivileges[app.userRols[user.userRol - 1]?.userPrivileges[0] - 1]?.collectionNames
          console.log(collectionNames, app.userRols[user.userRol - 1], "orderEffect")
          this.store.dispatch(new fromOrders.Query({
            collections_names: collectionNames
          }))
        }
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
            switch(message.notification?.title){
              case "Nuevo Rol Asignado":
                this.router.navigateByUrl("/");
            }
            console.log(message, "Notification");
            this.lastNotification = message;
            setTimeout(()=>{
              this.lastNotification = null;
            }, 3000)
          });
        }
      );
    }

  title = 'lomi-material';
}
