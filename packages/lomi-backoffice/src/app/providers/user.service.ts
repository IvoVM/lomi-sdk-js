import { Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc } from '@angular/fire/firestore';
import { IUser, User } from 'packages/lomi-backoffice/types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  addUserToken(userId:string, token:string){
    const document = doc(this.afs,`backoffice-users/${userId}/userDevices/${token}`)
    const fcmTokensDoc = doc(this.afs, 'backoffice-app/fcmTokens');
    updateDoc(fcmTokensDoc, {
      [token]: {
        userId: userId,
        token: token,
      }
    })
    setDoc(document,{
      token: token,
      userId: userId,
      id: token,
      navigator: navigator.userAgent,
    })
  }

  constructor(private afs:Firestore) { }
}
