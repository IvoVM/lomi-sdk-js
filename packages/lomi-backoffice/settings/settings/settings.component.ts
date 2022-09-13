import { Component, OnInit } from '@angular/core';
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
  ) {}

  ngOnInit(): void {
    this.journeyProviders.lastMileProviders$.subscribe((providers:any) => {
      this.lastMileProviders = Object.values(providers);
    })
  }
}
