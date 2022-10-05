import { Component, Input, OnInit } from '@angular/core';
import { Filter } from '../components/filters-side/filters-side.component';

@Component({
  selector: 'lomii-half-card',
  templateUrl: './half-card.component.html',
  styleUrls: ['./half-card.component.scss'],
})
export class HalfCardComponent implements OnInit {

  @Input() filters:Filter[] = []
  @Input() title:string = ''

  constructor() {}

  ngOnInit(): void {}
}
