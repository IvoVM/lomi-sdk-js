import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private httpClient:HttpClient) {

  }

  public sendNotification(title:string, description:string, data = {},url:string = "/"){
    console.log(title, description, data)
    const request = this.httpClient.post('https://us-central1-lomi-35ab6.cloudfunctions.net/sendNotificationByType',{
      notification: {
        title,
        body: description,
        click_action: url,
      },
      data: data
    })
    request.subscribe((res)=>{
      console.log(res)
    })
    return request
  }
}
