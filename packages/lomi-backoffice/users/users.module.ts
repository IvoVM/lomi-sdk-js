import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersIndexComponent } from './users-index/users-index.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UsersIndexComponent],
  imports: [CommonModule, SharedModule],
  exports: [SharedModule]
})
export class UsersModule {}
