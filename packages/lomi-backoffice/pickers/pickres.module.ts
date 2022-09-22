import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickersModalComponent } from './components/pickers-modal/pickers-modal.component';
import { SharedModule } from '../shared/shared.module';
import { PickerTableComponent } from './components/picker-table/picker-table.component';

@NgModule({
  declarations: [PickersModalComponent, PickerTableComponent],
  imports: [CommonModule, SharedModule],
  exports: [PickerTableComponent],
})
export class PickresModule {}
