import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GoogleLogin } from 'packages/lomi-backoffice/ngrx/actions/user.actions';

@Component({
  selector: 'lomii-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private store: Store,
  ) {}

  authWithGoogle(){
    this.store.dispatch(new GoogleLogin())
  }

  ngOnInit(): void {}
}
