import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';

@Component({
  selector: 'lomii-orders-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class OrdersHistoryComponent implements OnInit {
  constructor(
    public ordersProvider:OrdersService
  ) {}

  ngOnInit(): void {}
}
