import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickersModalComponent } from './components/pickers-modal/pickers-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PickersModalComponent],
  imports: [CommonModule, SharedModule],
  exports: []
})
export class PickresModule {}
