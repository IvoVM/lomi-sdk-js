import { StockLocationsService } from '../../../services/stock-locations.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatesService } from '../../../services/dates.service';
import { StockLocation } from '../../../types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  startDate: string = this.datesSVC.getTwoWeeksAgoDate();
  endDate = this.datesSVC.getCurrentDate();
  stockLocations: StockLocation[] = [];

  private actualLocation =
    this.stockLocationsService.getLocalStorageLocation().actualLocation;

  private selectedDateRangeSubject = new BehaviorSubject<string>(
    `${this.startDate} - ${this.endDate}`
  );
  private stockLocationSubject = new BehaviorSubject<string>('');
  stockLocationRange$ = this.stockLocationSubject.asObservable();
  selectedDateRange$ = this.selectedDateRangeSubject.asObservable();

  constructor(
    private datesService: DatesService,
    private stockLocationsService: StockLocationsService,
    private datesSVC: DatesService
  ) {}

  updateHeader(
    stockLocation: string = this.actualLocation,
    startDate: string = this.startDate,
    endDate: string = this.endDate
  ): void {
    this.updateHeaderDate(startDate, endDate);
    this.updateHeaderLocation(stockLocation);
  }

  updateHeaderLocation(stockLocation: string) {
    this.stockLocationSubject.next(stockLocation);
  }

  updateHeaderDate(startDate: string, endDate: string) {
    startDate = this.datesService.convertirFecha(startDate);
    endDate = this.datesService.convertirFecha(endDate);
    const newDateRange = `${startDate}-${endDate}`;
    this.updateSelectedDateRange(newDateRange);
  }

  updateSelectedDateRange(newDateRange: string) {
    this.selectedDateRangeSubject.next(newDateRange);
  }
}
