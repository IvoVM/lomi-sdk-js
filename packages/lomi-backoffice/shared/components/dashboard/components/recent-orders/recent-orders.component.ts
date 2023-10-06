import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ordersDataService } from '../../services/orders-data.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Order } from '../../types/order.types';
import { OrderInterface } from '../../types/recent-orders-types';
import { OffCanvasComponent } from '../off-canvas/off-canvas.component';

@Component({
  selector: 'lomii-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, OffCanvasComponent],
})
export class RecentOrdersComponent implements OnInit {
  recentOrders!: OrderInterface[];
  page = 1;
  dataLoaded = false;

  constructor(private ordersService: ordersDataService) {}
  ngOnInit(): void {
    this.getRecentOrders();
  }

  getRecentOrders() {
    this.ordersService.getOrdersDataSubject().subscribe((res) => {
      const data = res.map((order: Order) => {
        //Algunas de las órdenes no presentan la propiedad shipments, por eso es necesario verificar que exista.
        const shipments =
          Array.isArray(order.shipments) && order.shipments.length > 0
            ? order.shipments[0]
            : null;
        const lineItems = shipments ? shipments.line_items : [];
        return {
          channel: order.channel,
          id: order.id,
          payment_state: order.payment_state,
          total: order.total,
          shipments: lineItems,
          shipments_length: lineItems.length,
          email: order.email,
        };
      });
      this.recentOrders = data;
      this.dataLoaded = true;
      console.log(data);
    });
  }
}
