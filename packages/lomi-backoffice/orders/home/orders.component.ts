import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../providers/lomi/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'lomii-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public columnsToDisplay = ['number','name', 'completed_at', 'state','actions'];
  public commonColumns = ['name'];
  public filtersForm: FormGroup;
  public tabIndex = 0;
  public records: any = {};

  constructor(
    public ordersProvider:OrdersService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.filtersForm = this.formBuilder.group({
      stockLocationId: [null],
      deliveryState: ['Estado envio']
    })
  }

  stateName(state:any){
    switch(state){
      case "complete": return "Confirmado"
    }
    return state
  }

  showReceipt(){
    return
  }


  changeStockLocation(){
    this.ordersProvider.updateStockLocation(this.filtersForm.get('stockLocationId')?.value)
  }

  ngOnInit(): void {
    const currentStatus = this.router.url.split('#')[1]
    if(currentStatus){
      this.ordersProvider.currentStep = parseInt(currentStatus)
    }
    return
  }
}
