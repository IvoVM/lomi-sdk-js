import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './home/orders.component';
import { SharedModule } from '../shared/shared.module';
import { OrderComponent } from './components/recipe/order.component';
import { TableComponent } from './table/table.component';
import { DeliveryOperatorSelectorComponent } from './components/delivery-operator-selector/delivery-operator-selector.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderComponent,
    TableComponent,
    DeliveryOperatorSelectorComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [OrdersComponent, OrderComponent],
})
export class OrdersModule {}
