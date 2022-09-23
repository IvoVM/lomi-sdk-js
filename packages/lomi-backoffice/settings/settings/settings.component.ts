import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { LastMileProvidersService } from 'packages/lomi-backoffice/src/app/providers/last-mile-providers.service';

@Component({
  selector: 'lomii-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  userSettings: any = {};
  appSettings: any = {};
  lastMileProviders:any = [];
  constructor(
    private journeyProviders: LastMileProvidersService,
    private store:Store<BackofficeState>,
  ) {}

  ngOnInit(): void {
    this.journeyProviders.lastMileProviders$.subscribe((providers:any) => {
      this.lastMileProviders = Object.values(providers);
    })
    this.store.select(currentUserSelector).subscribe((user:any)=>{
      if (user) this.userSettings = user
    })
  }
}
