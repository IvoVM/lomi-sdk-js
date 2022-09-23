import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { statesMock } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { storesMock, storesMockAsArray } from '../../../providers/lomi/mocks/stores.mock';
import { Store } from '@ngrx/store';
import { Query } from 'packages/lomi-backoffice/ngrx/actions/orders.actions';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';

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
    private formBuilder: FormBuilder,
    private store:Store<BackofficeState>,
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
    this.store.select(currentUserSelector).subscribe((user:any)=>{
      if (user.stockLocationId && user.stockLocationId != -1) {
        let storeByUserStore = Object.values(storesMock).filter((store: any) => store.value == user.stockLocationId).map((s: any) => s.name)
        const storesFiltered = this.stores.filter((stores: any) => stores == storeByUserStore[0])
        const filterStoreIndex = this.filters.findIndex((filter: any) => filter.name.toLowerCase() == 'tienda')
        this.filters[filterStoreIndex].options = storesFiltered
      }
    })

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
