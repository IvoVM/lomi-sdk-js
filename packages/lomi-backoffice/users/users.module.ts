import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersIndexComponent } from './users-index/users-index.component';
import { SharedModule } from '../shared/shared.module';
import { UserWithoutRolComponent } from './user-without-rol/user-without-rol.component';

@NgModule({
  declarations: [UsersIndexComponent, UserWithoutRolComponent],
  imports: [CommonModule, SharedModule],
  exports: [SharedModule],
})
export class UsersModule {}
