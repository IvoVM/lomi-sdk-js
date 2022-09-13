import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SharedModule],
  exports: [SettingsComponent],
})
export class SettingsModule {}
