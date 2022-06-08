import { Component, OnInit } from '@angular/core';
import { Promotions } from '@lomi-sdk/lomi-sdk'

@Component({
  selector: 'lomi-promotions',
  templateUrl: './lomi-promotions.html',
  styleUrls: ['./lomi-promotions.scss'],
})
export class LomiPromotionsComponent implements OnInit {

  promotions:any;

  constructor() {}

  async ngOnInit(){
    this.promotions = await Promotions.fetchDeliveryPromotions()
  }
}
