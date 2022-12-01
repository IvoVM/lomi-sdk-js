import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockItemsComponent } from './stock-items/stock-items.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [StockItemsComponent],
  imports: [CommonModule, SharedModule],
})
export class StockModule {}
