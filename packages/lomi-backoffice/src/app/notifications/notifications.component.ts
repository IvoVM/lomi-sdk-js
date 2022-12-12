import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { collection, doc, limit, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { createHistogram } from 'perf_hooks';
import { NotificationsService } from '../providers/notifications.service';
import { UserService } from '../providers/user.service';

type notificationType = [
  id?: any,
  notification?: {
    title?: string,
    body?: string
  }
]
@Component({
  selector: 'lomii-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  public userId:any = 0;
  notificationsList: notificationType = []
  public lastNotification:any;

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private userService: UserService,
    private afs: Firestore,
    public router: Router,
    public store: Store<BackofficeState>
  ) {}

  ngOnInit(): void {
    this.store.select("user").subscribe((user:any)=>{
      if(user.uid){
        this.userId = user.uid;
        this.getNotificationsByUser()
        this.requestMessagingPermission();
      }
    })
  }

  private requestMessagingPermission(){
    this.angularFireMessaging.requestToken.subscribe((token) => {
      console.log(token, "token", this.userId);
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
          if(message.data){
            const data = message.data as any;
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

  getNotificationsByUser() {
    const q = query(collection(this.afs, `backoffice-users/${this.userId}/notifications`), limit(25))
    onSnapshot(q, { includeMetadataChanges: true } , (snapShotResponse) => {
      this.notificationsList = []
      snapShotResponse.forEach((doc) => {
        this.notificationsList.push({
          id: doc.id,
          title: doc.data()['notification'].title,
         body: doc.data()['notification'].body
        })
      })
    })
  }

  async deleteNotification(id: any) {
    const deletedNotification = doc(this.afs, `backoffice-users/${this.userId}/notifications`, id);

    await updateDoc(deletedNotification, {
      isActive: false
    });
  }
}
