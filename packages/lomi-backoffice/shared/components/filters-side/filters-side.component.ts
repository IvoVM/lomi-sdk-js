import { Component, OnInit } from '@angular/core';
import { statesMock } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';

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
  public filters:Filter[] = [
    {
      name: 'Estado',
      type: 'select',
      options: statesMock
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
      name: 'Cliente',
      type: 'input',
    },
  ]

  constructor() {}

  ngOnInit(): void {}
}
