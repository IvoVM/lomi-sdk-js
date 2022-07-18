import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lomii-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit {

  @Input() lineItem:any;

  constructor() {}

  ngOnInit(): void {}
}
