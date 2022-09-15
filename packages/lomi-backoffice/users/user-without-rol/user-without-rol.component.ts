import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { storesMock }  from 'packages/lomi-backoffice/providers/lomi/mocks/stores.mock';
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

  constructor(
    private store: Store<BackofficeState>
  ) {}

  ngOnInit(): void {
    this.store.select("user").subscribe(user=>{
      this.user = user;
    })
  }
}
