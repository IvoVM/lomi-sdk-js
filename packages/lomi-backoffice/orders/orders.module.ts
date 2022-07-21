import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './home/orders.component';
import { SharedModule } from '../shared/shared.module';
import { OrderComponent } from './components/recipe/order.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [OrdersComponent, OrderComponent, TableComponent],
  imports: [CommonModule, SharedModule],
  exports: [OrdersComponent, OrderComponent],
})
export class OrdersModule {}
