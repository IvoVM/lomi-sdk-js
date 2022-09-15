import { Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc, docData } from '@angular/fire/firestore';
import { IUser, User } from 'packages/lomi-backoffice/types/user';
import { lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  addUserToken(userId:string, token:string){
    const document = doc(this.afs,`backoffice-users/${userId}/userDevices/${token}`)
    const fcmTokensDoc = doc(this.afs, 'backoffice-app/fcmTokens');
    docData(fcmTokensDoc).pipe(take(1)).subscribe((data:any)=>{
      const tokens = data
      updateDoc(fcmTokensDoc, {
        [token]: {
          ...tokens[token],
          userId: userId,
          token: token,
          id: token,
          updated_at: new Date(),
        }
      })
      return tokens
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
