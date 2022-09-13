import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { statesMock } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { storesMock, storesMockAsArray } from '../../../providers/lomi/mocks/stores.mock';
import { MatFormFieldControl } from '@angular/material/form-field'; 
import { Store } from '@ngrx/store';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/orders.actions';
import { CHANGE_STOCK_LOCATION } from 'packages/lomi-backoffice/ngrx/actions/app.actions';

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
  public stores = storesMockAsArray
  public filtersForm: any;
  public filters:Filter[] = [
    {
      name: 'Estado',
      type: 'select',
      options: statesMock,
    },
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
    console.log(event)
  }

  constructor(
    private ordersProvider:OrdersService,
    private formBuilder: FormBuilder,
    private store:Store,
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
    this.filtersForm.valueChanges.subscribe((value:any)=>{
      const queryValues:any = {}
      if(value['Tienda']) { 
        queryValues.stock_location_id = Object.keys(storesMock)[Object.values(storesMock).findIndex((store:any)=>store.name == value['Tienda'])]
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
      console.log(value)
    })
  }
}
