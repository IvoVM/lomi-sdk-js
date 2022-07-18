import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../providers/lomi/orders.service';
import { FirestoreService } from '../..//src/providers/firestore.service';
import { Recipe } from '../..//types/recipes';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'lomii-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  public recipes:Array<Recipe> = [];
  public filtersForm: FormGroup;


  constructor(
    public ordersProvider:OrdersService,
    private formBuilder: FormBuilder
  ) {
    this.filtersForm = this.formBuilder.group({
      stockLocationId: ['Tienda']
    })

  }

  ngOnInit(): void {

    return
  }
}
