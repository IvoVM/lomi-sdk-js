import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { LastMileProvidersService } from 'packages/lomi-backoffice/src/app/providers/last-mile-providers.service';
import { App } from 'packages/lomi-backoffice/types/app';
import { Resource } from 'packages/lomi-backoffice/types/resources';
import { Unsubscribable } from 'rxjs';

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

  currentUserUnsubscribable: Unsubscribable | undefined;
  storeAppUnsubscribable: Unsubscribable | undefined;
  
  constructor(
    private journeyProviders: LastMileProvidersService,
    private store:Store<BackofficeState>,
  ) {}

  ngOnInit(): void {
    this.storeAppUnsubscribable = this.store.select("app").subscribe((app:App)=>{
      this.resources = app.resources
    })
    this.journeyProviders.lastMileProviders$.subscribe((providers:any) => {
      this.lastMileProviders = Object.values(providers);
    })
    this.currentUserUnsubscribable = this.store.select(currentUserSelector).subscribe((user:any)=>{
      if (user) this.userSettings = user
    })
  }

  ngOnDestroy(){
    this.currentUserUnsubscribable?.unsubscribe();
    this.storeAppUnsubscribable?.unsubscribe();
  }
}
