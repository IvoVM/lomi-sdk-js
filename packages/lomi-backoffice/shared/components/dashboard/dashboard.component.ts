import { StockLocationsService } from './services/stock-locations.service';
import { HeaderService } from './components/header/service/header.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentOrdersComponent } from './components/recent-orders/recent-orders.component';
import { TopProductsComponent } from './components/top-products/top-products.component';
import { HeaderComponent } from './components/header/header.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ordersDataService } from './services/orders-data.service';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'lomii-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RecentOrdersComponent,
    TopProductsComponent,
    HeaderComponent,
    SettingsComponent,
    LoadingScreenComponent,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnInit {
  headerLocation!: string;
  headerDate!: string;
  stockLocationId!: string;
  constructor(
    private ordersService: ordersDataService,
    private headerService: HeaderService,
    private StockLocationsService: StockLocationsService
  ) {}
  ngOnInit(): void {
    this.setHeaderData();
    this.initialLoadingSetup();
  }
  initialLoadingSetup() {
    this.StockLocationsService.getUsersLocation().subscribe((response:any) => {
      this.stockLocationId = response;
      this.ordersService.fetchOrders(this.stockLocationId);
      const location_name = this.StockLocationsService.findStockLocationById(
        this.stockLocationId
      );
      this.StockLocationsService.saveStockLocation(location_name);
      this.headerService.updateHeader(location_name.viewValue);
    });
  }
  setHeaderData() {
    this.headerService.stockLocationRange$.subscribe((location: string) => {
      this.headerLocation = location;
    });
    this.headerService.selectedDateRange$.subscribe((dateRange: string) => {
      this.headerDate = dateRange;
    });
  }
}
