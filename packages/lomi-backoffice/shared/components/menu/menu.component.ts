import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { MenuService } from '../../../providers/lomi/ menu.service';
import { Menu } from '../../../types/menu';

@Component({
    selector: 'lomii-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
  })
  export class MenuComponent implements OnInit {
      
    constructor(
      public menuProvider:MenuService,
      public router:Router,
    ) {}
  
    ngOnInit(): void {
     return
    }
  }
  