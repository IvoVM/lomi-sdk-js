import { Component, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { OrdersService } from 'packages/lomi-material/providers/lomi/orders.service';
import { FirestoreService } from 'packages/lomi-material/src/providers/firestore.service';
import { Recipe } from 'packages/lomi-material/types/recipes';
import { throwIfEmpty } from 'rxjs';

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
