import { Component, OnInit } from '@angular/core';
import { catalogue } from '@lomi-sdk/lomi-sdk'

@Component({
  selector: 'lomii-stock-items',
  templateUrl: './stock-items.component.html',
  styleUrls: ['./stock-items.component.scss'],
})
export class StockItemsComponent implements OnInit {
  public items = [];
  public search = "";

  constructor() {
    const stockLocationId = localStorage.getItem("stockLocationId") || ""
    catalogue.events.onProductAvailable((params:any)=>{
      console.log(params.productId)
      const product:any = this.items.find((item:any)=>item.id == params.productId)
      if(product){
        product.individual_sale = true
      }
    })
    catalogue.events.onProductUnavailable((params:any)=>{
      console.log(params.productId)
      const product:any = this.items.find((item:any)=>item.id == params.productId)
      if(product){
        product.individual_sale = false
      }
    })
    catalogue.getProducts(stockLocationId).then((items:any)=>{
      this.items = items
    })
  }

  public searchProduct(event:any){
    console.log(event.target.value)
    if(!event.target.value){
      const stockLocationId = localStorage.getItem("stockLocationId") || ""
      catalogue.getProducts(stockLocationId).then((items:any)=>{
        this.items = items
      })
      return
    }
    const stockLocationId = localStorage.getItem("stockLocationId") || ""
    catalogue.searchProduct(stockLocationId,event.target.value,"").then((items:any)=>{
      console.log(items, "items")
      this.items = items
    })
  }

  public toggleAvaibility(item:any){
    console.log(item)
    const stockLocationId = localStorage.getItem("stockLocationId") || ""
    if(item.individual_sale){
      catalogue.disableProduct(item.id, stockLocationId)
    } else {
      catalogue.enableProduct(item.id, stockLocationId)
    }
  }

  public totalStockOfItem(item:any) {
    return item.variants.reduce((acc:any, stockItem:any) => {
      return acc + stockItem.total_on_hand;
    }, 0);
  }

  ngOnInit(): void {}
}
