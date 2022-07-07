import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../providers/lomi/orders.service';


@Component({
  selector: 'lomi-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;

  public order:any;

  constructor( 
    public activatedRoute:ActivatedRoute,
    public ordersProvider:OrdersService
    
    ){

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params:any)=>{
      this.order = this.ordersProvider.getOrderByNumber(params.number)
      console.log(this.order)
    })
  }
}
