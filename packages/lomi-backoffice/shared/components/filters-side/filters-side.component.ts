import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { statesMock } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { storesMock, storesMockAsArray } from '../../../providers/lomi/mocks/stores.mock';
import { Store } from '@ngrx/store';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/orders.actions';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Unsubscribable } from 'rxjs';
import { App } from 'packages/lomi-backoffice/types/app';
import { SearcherService } from 'packages/lomi-backoffice/src/app/orders/searcher.service';

export type Filter = {
  name: string;
  type: string;
  options?: any[];
}

@Component({
  selector: 'lomii-filters-side',
  templateUrl: './filters-side.component.html',
  styleUrls: ['./filters-side.component.scss'],
})
export class FiltersSideComponent implements OnInit {

  private currentUserSelectorUnsubscribe: Unsubscribable | undefined;
  private backofficeAppUnsubscribe: Unsubscribable | undefined;

  public stores = storesMockAsArray
  public filtersForm: any;
  public filters:Filter[] = [
    {
      name: 'Fecha Inicio',
      type: 'date',
    },
    {
      name: 'Fecha Fin',
      type: 'date',
    },
    {
      name: 'Correo',
      type: 'input',
    },
    {
      name: 'Numero de pedido',
      type: 'input',
    },
    {
      name: 'Cliente',
      type: 'input',
    },
    {
      name: 'Tienda',
      type: 'select',
      options: this.stores
    },
    {
      name: "Limite de ordenes",
      type: "select",
      options: [
        10, 25, 50, 100
      ]
    }
  ]

  select(event:any){
  }

  constructor(
    private formBuilder: FormBuilder,
    private store:Store<BackofficeState>,
    public searcherService: SearcherService
  ) {
    const formGroup = this.filters.reduce((acc:any = {},filter)=>{
      if(!acc.name){
        acc[filter.name] = new FormControl(filter.name == 'Tienda' ? 'Balmoral 309 local 217 - Las Condes': '')
        return acc
      }  else {
        return { [acc.name]: new FormControl(''), [filter.name]: new FormControl('')}
      }
    })
    this.filtersForm= this.formBuilder.group(formGroup)
  }

  ngOnInit(): void {
    this.currentUserSelectorUnsubscribe = this.store.select(currentUserSelector).subscribe((user:any)=>{
      if (user.stockLocationId && user.stockLocationId != -1) {
        const storeFilterIndex = this.filters.findIndex((filter)=>filter.name == 'Tienda')
        if(storeFilterIndex != -1){
          this.filters.splice(storeFilterIndex,1)
        }
      }
    })
    
    this.backofficeAppUnsubscribe = this.store.select('app').subscribe((app:App)=>{
      this.stores = app.resources.filter((resource:any)=>resource.type == 'SPREE_STOCK_LOCATION')
      const options = this.filters.find((filter:Filter)=>filter.name == 'Tienda')
      if(options){
        options.options = this.stores.map((store:any)=>store.name)
        if(localStorage.getItem("stockLocationId")){
          this.filtersForm.get('Tienda').setValue(this.stores.find((store:any)=>store.stockLocationId == localStorage.getItem("stockLocationId")).name)
        }
      }
    })

    this.filtersForm.valueChanges.subscribe((value:any)=>{
      const queryValues:any = {}
      if(value['Tienda']) { 
        queryValues.stock_location_id = this.stores.find((store:any)=>store.name == value['Tienda']).stockLocationId
      }
      if(value['Limite de ordenes']) {
        queryValues.per_page = +value['Limite de ordenes']
      }
      if(value['Cliente']) {
        queryValues.name = value['Cliente']
      }
      if(value['Numero de pedido']) {
        queryValues.number = value['Numero de pedido']
      }
      if(value['Correo']) {
        queryValues.email = value['Correo']
      }
      if(value['Fecha Inicio']) {
        queryValues.startsAt = value['Fecha Inicio']
      }
      if(value['Fecha Fin']) {
        queryValues.endsAt = value['Fecha Fin']
      }
      this.store.dispatch(new Query(queryValues))
    })
  }
}
