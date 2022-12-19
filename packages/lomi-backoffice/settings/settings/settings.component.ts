import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { EditStoreComponent } from 'packages/lomi-backoffice/shared/modals/edit-store/edit-store.component';
import { LastMileProvidersService } from 'packages/lomi-backoffice/src/app/providers/last-mile-providers.service';
import { App } from 'packages/lomi-backoffice/types/app';
import { Resource, SpreeStockLocationResource } from 'packages/lomi-backoffice/types/resources';
import { combineLatest, Unsubscribable } from 'rxjs';

@Component({
  selector: 'lomii-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  userSettings: any = {};
  appSettings: any = {};
  lastMileProviders:any = [];
  resources: Resource[] = [];
  stores: SpreeStockLocationResource[] = [];

  currentUserUnsubscribable: Unsubscribable | undefined;
  storeAppUnsubscribable: Unsubscribable | undefined;
  currentResourceUnsubscribable: Unsubscribable | undefined;
  
  constructor(
    private journeyProviders: LastMileProvidersService,
    private store:Store<BackofficeState>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.store.select("app"),
      this.journeyProviders.lastMileProviders$,
      this.store.select(currentUserSelector)
    ).subscribe(([app, providers, user]: [any, any, any]) => {
      this.lastMileProviders = Object.values(providers);
      this.resources = user.userRol == 'Admin' ? app.resources : app.resources.filter((resource:SpreeStockLocationResource)=>{
        return resource.stockLocationId == user.stockLocationId
      })
      if (user) this.userSettings = user
      this.stores = this.getStores() as SpreeStockLocationResource[]
    })
  }

  public editStore(store:SpreeStockLocationResource){
    this.dialog.open(EditStoreComponent, {
      data: store,
      width: '500px',
    })
  }

  getStores(){
    return this.resources.filter((resource:Resource)=>{
      return this.userSettings.userRol == 'Admin' ? resource.type == 'SPREE_STOCK_LOCATION' : resource.type == 'SPREE_STOCK_LOCATION' && resource.stockLocationId == this.userSettings.stockLocationId
    })
  }

  ngOnDestroy(){
    this.currentUserUnsubscribable?.unsubscribe();
    this.storeAppUnsubscribable?.unsubscribe();
  }
}
