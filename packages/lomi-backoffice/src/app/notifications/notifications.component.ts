import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Router } from '@angular/router';
import { UserService } from '../providers/user.service';

@Component({
  selector: 'lomii-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  public userId:any = 0;
  public lastNotification:any;

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private userService: UserService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.requestMessagingPermission();

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
}
