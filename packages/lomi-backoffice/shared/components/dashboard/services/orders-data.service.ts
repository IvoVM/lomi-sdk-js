import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import API_URL from '../environments/orders.api';
import { DatesService } from './dates.service';
import { Order } from '../types/order.types';

@Injectable({
  providedIn: 'root',
})
export class ordersDataService {
  limit: number = 10;
  startDate: string = this.datesSVC.getTwoWeeksAgoDate();
  endDate: string = this.datesSVC.getCurrentDate();

  private dataSubject: Subject<Order[]> = new Subject<any>();

  constructor(private http: HttpClient, private datesSVC: DatesService) {}
  fetchOrders(
    stockLocation = '49',
    startDate: string = this.startDate,
    endDate: string = this.endDate
  ): void {
    let url = `${API_URL}/showLastOrders?stockLocation=${stockLocation}&limit=${this.limit}&startsAt=${startDate}&endsAt=${endDate}`;
    this.http.get<Order[]>(url).subscribe((response: Order[]) => {
      this.dataSubject.next(response);
    });
  }

  getOrdersDataSubject(): Subject<Order[]> {
    return this.dataSubject;
  }
}
