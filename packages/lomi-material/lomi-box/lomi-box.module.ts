import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LomiBoxListComponent } from './lomi-box-list/lomi-box-list.component';
import { LomiBoxComponent } from './components/lomi-box/lomi-box.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LomiBoxListComponent, LomiBoxComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [LomiBoxComponent],
})
export class LomiBoxModule {}
