import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickersModalComponent } from 'packages/lomi-backoffice/pickers/components/pickers-modal/pickers-modal.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/app.actions';
import * as fromOrders from 'packages/lomi-backoffice/ngrx/actions/orders.actions';
import { OrdersService } from '../../providers/lomi/orders.service';

import { combineLatestWith, lastValueFrom, take } from 'rxjs';
import { App } from 'packages/lomi-backoffice/types/app';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public userId:any = 0;
  public stockLocationId:any = 0;

  constructor(
    public orders:OrdersService,
    public store:Store<BackofficeState>,
    public router: Router,
    public dialog: MatDialog
    ){
      this.store.dispatch(new Query())
      this.store.select("user").pipe(
        combineLatestWith(
          this.store.select("app"),
      )).subscribe(async (args: [user:any, app:App])=>{
        const [user,app] = args;
        this.userId = user.uid
        if(app?.userPrivileges){
          const collectionNames = app.userPrivileges[app.userRols[user.userRol - 1]?.userPrivileges[0] - 1]?.collectionNames
          console.log(collectionNames, app.userRols[user.userRol - 1], "orderEffect")
          this.store.dispatch(new fromOrders.Query({
            collections_names: collectionNames
          }))
        }
      })
    }
    



  openPickersDialog(): void {
    this.dialog.open(PickersModalComponent, {
    });
  }
}
