import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { UserRolComponent } from './user-rol/user-rol.component';
import { AddUserRolDialogComponent } from './user-rol/add-user-rol-dialog/add-user-rol-dialog.component';

@NgModule({
  declarations: [
    SettingsComponent,
    UserRolComponent,
    AddUserRolDialogComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [SettingsComponent],
})
export class SettingsModule {}
