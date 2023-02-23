import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../providers/lomi/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearcherService } from 'packages/lomi-backoffice/src/app/orders/searcher.service';

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
  public searchedRecords: any = []

  public unsubscribes: any = [];

  constructor(
    public ordersProvider:OrdersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private searcherService: SearcherService
  ) {
    this.filtersForm = this.formBuilder.group({
      stockLocationId: [null],
      deliveryState: ['Estado envio']
    })

    this.router.events.subscribe(async (event: any) => {
      if (event.anchor) {
        const st = localStorage.getItem('stockLocationId')
        const getOrder = await this.ordersProvider.getOrder(event.anchor, st)
        const order: any = getOrder.data()
        if (!order) return
        const { status } = order
        this.ordersProvider.currentStep = status
      }
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

  ngOnDestroy(): void {
    this.unsubscribes.forEach((unsubscribable:any) => {
      unsubscribable.unsubscribe()
    })
  }

  ngOnInit(): void {
    const currentStatus = this.router.url.split('#')[1]
    if(currentStatus){
      this.ordersProvider.currentStep = parseInt(currentStatus)
    }
    this.unsubscribes.push(
      this.searcherService.hitsObservable.subscribe((hits:any) => {
        this.searchedRecords = hits
      })
    )
    return
  }
}
