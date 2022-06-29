import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    public signedIn:boolean = false;
    public authState:any;

    constructor(public auth: AngularFireAuth, private router:Router){
        this.auth.authState.subscribe((authState)=>{
          console.log(authState,"auth")    
          this.authState = authState;
          this.signedIn = authState ? true : false
          this.router.navigateByUrl("/")
        })
        auth.credential.subscribe((credentials)=>{
          console.log(credentials,"cred")
        })
        return
    }

    loginWithGoogle(){
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    }

    login(user:any) {
      return
      }

      logout() {
        this.auth.signOut().then((res)=>{
          console.log(res)
          this.router.navigateByUrl("/auth")
        });
      } 
    
}
  