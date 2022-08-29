import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Modified, Query, Update } from 'packages/lomi-backoffice/ngrx/actions/users.actions';
import { selectEntities } from 'packages/lomi-backoffice/ngrx/reducers/orders.reducer';
import { App } from 'packages/lomi-backoffice/types/app';
import { IUser, UserRol } from 'packages/lomi-backoffice/types/user';
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
  public rols:UserRol[] = []
  public columnsToDisplay = ['email', 'id', 'rol', 'expandedDetail']
  public expandedElement : IUser | null = null;

  constructor( private store:Store<BackofficeState> ) {
    this.store.dispatch(new Query({}))
    this.store.select('app').subscribe((app:App)=>{
      this.rols = app.userRols
      console.log(this.rols)
      debugger
    })
    this.store.select('users').pipe(
      map((users:any)=>Object.values(users.entities))
    ).subscribe((users:any)=>{
      this.users = users
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


  ngOnInit(): void {}
}
