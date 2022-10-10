import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Modified, Query, Update } from 'packages/lomi-backoffice/ngrx/actions/users.actions';
import { selectEntities } from 'packages/lomi-backoffice/ngrx/reducers/orders.reducer';
import { AddUserRolDialogComponent } from 'packages/lomi-backoffice/settings/user-rol/add-user-rol-dialog/add-user-rol-dialog.component';
import { App } from 'packages/lomi-backoffice/types/app';
import { IUser, UserPrivelege, UserRol } from 'packages/lomi-backoffice/types/user';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lomii-users-index',
  templateUrl: './users-index.component.html',
  styleUrls: ['./users-index.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class UsersIndexComponent implements OnInit {

  public users: IUser[] = []
  public privileges: UserPrivelege[] = [];
  public rols:UserRol[] = []
  public columnsToDisplay = ['email',  'rol', 'expandedDetail']
  public expandedElement : IUser | null = null;

  getRolName(rol:number){
    const rolName = this.rols.find(rolName=>rolName.id == rol)?.rolName
    return rolName
  }

  addPrivilege(){
    this.matDialog.open(AddUserRolDialogComponent)
  }

  constructor( 
    private store:Store<BackofficeState> , 
    private router:Router,
    private matDialog: MatDialog,
  ) {
    this.store.dispatch(new Query({}))
    this.store.select('app').subscribe((app:App)=>{
      this.rols = app.userRols
      this.privileges = app.userPrivileges
      console.log(this.rols)
    })
    this.store.select('users').pipe(
      map((users:any)=>Object.values(users.entities))
    ).subscribe((users:any)=>{
      this.users = users
      const user = this.users.find(user=>user.uid == this.router.url.split("#")[1])
      console.log(this.users,"users")
      if(user){
        this.router.navigateByUrl("/users")
        this.expandedElement = user;
      }
    })
  }

  elementExpanded = (row:any, info:any) => {
    console.log(row,info)
    return info === this.expandedElement;
  }

  preventDefault(event: Event) {
    event.stopPropagation()
  }



  updateRol(rol:number, user:IUser){
    this.store.dispatch(new Update(
      user.uid,
      {
      userRol: rol
      }
    ))
  }

  toggleElement(element:any){
    const user = this.users.find(user=>user == element)
    if(user){
      console.log(this.expandedElement)
      if(this.expandedElement){
        this.expandedElement = null
      } else {
        this.expandedElement = user;
      }
    }
    return element
  }


  ngOnInit(): void {

  }
}
