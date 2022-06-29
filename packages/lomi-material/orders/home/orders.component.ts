import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../providers/lomi/orders.service';
import { FirestoreService } from '../..//src/providers/firestore.service';
import { Recipe } from '../..//types/recipes';

@Component({
  selector: 'lomii-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  public recipes:Array<Recipe> = [];

  constructor(
    private firestore:FirestoreService,
    public ordersProvider:OrdersService
  ) {
  }

  ngOnInit(): void {
    this.firestore.recipes$.subscribe((recipes:any)=>{
      this.recipes = recipes
    })
  }
}
