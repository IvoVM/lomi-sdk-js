import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { App } from 'packages/lomi-backoffice/types/app';
import { UserRol } from 'packages/lomi-backoffice/types/user';
import { AddUserRolDialogComponent } from './add-user-rol-dialog/add-user-rol-dialog.component';

@Component({
  selector: 'lomii-user-rol',
  templateUrl: './user-rol.component.html',
  styleUrls: ['./user-rol.component.scss'],
})
export class UserRolComponent implements OnInit {

  public userRol: UserRol | undefined;
  public storeUserRolsUnsubscribable: any;

  constructor(
    private router: Router,
    private store: Store<BackofficeState>,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.storeUserRolsUnsubscribable = this.store.select("app").subscribe((app: App) => {
      const userRols = app.userRols;
      const userRolId = this.router.url.split("/").pop();
      if (userRols && userRolId) {
        this.userRol = userRols.find((userRol: UserRol) => userRol.id == +userRolId);
      }
    });
  }

  public addUserRol(){
    this.matDialog.open(AddUserRolDialogComponent)
  }

  ngOnDestroy() {
    this.storeUserRolsUnsubscribable?.unsubscribe();
  }
}
