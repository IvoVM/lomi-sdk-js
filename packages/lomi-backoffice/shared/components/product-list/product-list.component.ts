import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'lomi-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.scss'],
  })
  export class MenuComponent implements OnInit {

    @Input() products:any = []
      
    constructor() {}
  
    ngOnInit(): void {}
  }
  