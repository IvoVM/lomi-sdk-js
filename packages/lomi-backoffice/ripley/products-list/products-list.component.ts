import { Component, OnInit } from '@angular/core';
import { RipleyService } from './ripley.service';

@Component({
  selector: 'lomii-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  constructor(private ripley: RipleyService) {}

  ngOnInit(): void {}
}
