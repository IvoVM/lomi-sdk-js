import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './home/orders.component';
import { SharedModule } from '../shared/shared.module';
import { OrderComponent } from './components/recipe/order.component';
import { TableComponent } from './table/table.component';
import { DeliveryOperatorSelectorComponent } from './components/delivery-operator-selector/delivery-operator-selector.component';
import { PickerSelectComponent } from './picker-select/picker-select.component';
import { OrdersHistoryComponent } from './history/history.component';
import { ReintegrateOrderComponent } from './components/reintegrate-order/reintegrate-order.component';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { IncidentComponent } from './incident/incident.component';
import { SearcherComponent } from './searcher/searcher.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderComponent,
    TableComponent,
    DeliveryOperatorSelectorComponent,
    PickerSelectComponent,
    OrdersHistoryComponent,
    ReintegrateOrderComponent,
    IncidentComponent,
    SearcherComponent,
  ],
  providers: [GoogleMapsAPIWrapper],
  imports: [CommonModule, SharedModule],
  exports: [OrdersComponent, OrderComponent, IncidentComponent],
})
export class OrdersModule {}
