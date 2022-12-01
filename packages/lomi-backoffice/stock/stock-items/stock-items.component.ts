import { Component, OnInit } from '@angular/core';
import { catalogue } from '@lomi-sdk/lomi-sdk'

@Component({
  selector: 'lomii-stock-items',
  templateUrl: './stock-items.component.html',
  styleUrls: ['./stock-items.component.scss'],
})
export class StockItemsComponent implements OnInit {
  public items:any = [];
  public search = "";

  constructor() {
    this.items = catalogue.getStockItems("39")
  }

  public searchProduct(event:any){
    console.log(event.target.value)
    this.items = catalogue.searchProduct("39",event.target.value,"")
  }

  ngOnInit(): void {}
}
