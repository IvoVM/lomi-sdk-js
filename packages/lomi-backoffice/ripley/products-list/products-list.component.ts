import { Component, OnInit } from '@angular/core';
import { RipleyService } from './ripley.service';

@Component({
  selector: 'lomii-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {

  public categoryExpanded = ""
  public subcategoryExpanded = ""
  public thirdLevelExpanded = ""

  public ripleySpreeTaxons:any = 
    {
      // Carnes
      "R060101010000" : [1283,1284,1285,1286],
      // Pescados y Mariscos
      "R060101020000" : [1254, 2522, 1465],
      // Fiambres y Embutidos
      "R060102010000" : [1255, 2523, 1466],
      // Lácteos
      "R060104020000" : [1469,1470,1468],
      // Frutas
      "R060103020000": [1522],
      // Verduras
      "R060103040000": [1523],
      // Frutos Secos
      "R060103030000": [2655],
    }

  constructor(public ripley: RipleyService) {
  }

  ngOnInit(): void {}
}
