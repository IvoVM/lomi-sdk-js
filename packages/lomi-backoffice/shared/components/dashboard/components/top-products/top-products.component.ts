import { topProductsService } from './../../services/top-products.service';
import { Component, OnInit } from '@angular/core';
import { ordersDataService } from '../../services/orders-data.service';
import { CommonModule } from '@angular/common';
import { TopProductsTableComponent } from './components/top-products-table/top-products-table.component';
import { GraphicComponent } from './components/graphic/graphic.component';
import { GraphicData } from '../../types/top-products.types';
import { Order } from '../../types/order.types';

@Component({
  selector: 'lomii-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss'],
  standalone: true,
  imports: [CommonModule, TopProductsTableComponent, GraphicComponent],
})
export class TopProductsComponent implements OnInit {
  Table: Order[] = [];
  graphic_data: GraphicData = { porcentajes: [100], names: ['Sin Data'] };
  constructor(
    private ordersService: ordersDataService,
    private topProductsService: topProductsService
  ) {}
  ngOnInit(): void {
    this.ordersService.getOrdersDataSubject().subscribe((res) => {
      const itemData = this.topProductsService.countLineProducts(res);
      this.Table = this.topProductsService.getTopProducts(itemData, 5);
      this.graphic_data = this.topProductsService.calcularPorcentajes(
        this.Table
      );
    });
  }
}
