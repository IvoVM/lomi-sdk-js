import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { storesMock }  from 'packages/lomi-backoffice/providers/lomi/mocks/stores.mock';
import { NotificationsService } from 'packages/lomi-backoffice/src/app/providers/notifications.service';
import { IUser } from 'packages/lomi-backoffice/types/user';

@Component({
  selector: 'lomii-user-without-rol',
  templateUrl: './user-without-rol.component.html',
  styleUrls: ['./user-without-rol.component.scss'],
})
export class UserWithoutRolComponent implements OnInit {
  public stores:Array<any> = storesMock;
  public user: IUser = {
    uid: "",
    email: "",
    userRol: 0,
  };
  public userRols:any;
  public userPrivileges:any;
  
  constructor(
    private store: Store<BackofficeState>,
    private notifications: NotificationsService,
  ) {}

  requestAccess(store:any){
    console.log(store.value.value)

    this.notifications.sendNotification(
      `Solicitud de acceso, ${store.value.name}`,
      `El usuario ${this.user.email} ha solicitado acceso al backoffice`,
      {
        type: `SPREE_ORDERS_${store.id}:NEW_USER`,
      },
      "/users#"+this.user.uid
    )
  }

  ngOnInit(): void {
    this.store.select("user").subscribe(user=>{
      this.user = user;
    })
    this.store.select("app").subscribe(app=>{
      this.userPrivileges = app.userPrivileges;
      this.userRols = app.userRols;
    })
  }
}
