import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, map, Observable, pipe } from 'rxjs';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user:any;

  constructor(private afAuth:AngularFireAuth, private router: Router, private store:Store<BackofficeState>) {
    this.store.select('user').subscribe((user:any)=>{
      this.user = user
      console.log("From AuthGuard", user)
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.afAuth.user.pipe(
          map((user)=>{
            if(user){
              console.log(this.user)
              if(this.user.id && !(this.user.userRol)){
                console.log(this.user)
                this.router.navigate(['/user-without-rol'])
                return false
              }
              return true
            }else{
              this.router.navigateByUrl('/auth')
              return false
            }
          })
        )
      
  }
  
}
