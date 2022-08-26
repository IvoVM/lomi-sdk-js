import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../providers/lomi/orders.service';
import { FirestoreService } from '../..//src/providers/firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    private formBuilder: FormBuilder
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
    return
  }
}
