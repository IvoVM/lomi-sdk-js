import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { SharedModule } from '../shared/shared.module';
import { CsvModalComponent } from './csv-modal/csv-modal.component';

@NgModule({
  declarations: [ProductsListComponent, CsvModalComponent],
  imports: [CommonModule, SharedModule],
})
export class RipleyModule {}
