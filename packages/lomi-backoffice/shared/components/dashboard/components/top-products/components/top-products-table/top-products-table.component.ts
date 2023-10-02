import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lomii-top-products-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-products-table.component.html',
  styleUrls: ['./top-products-table.component.scss'],
})
export class TopProductsTableComponent {
  @Input() Table: Array<any> = [];
  lomi_logo =
    'https://lomi.cl/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMThjQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bedcc2ae48446b27bfcd71352e6987e9ac5c9e14/logo.png';
}
