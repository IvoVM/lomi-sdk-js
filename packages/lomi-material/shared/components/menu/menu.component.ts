import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { MenuService } from 'packages/lomi-material/providers/lomi/ menu.service';
import { Menu } from 'packages/lomi-material/types/menu';

@Component({
    selector: 'lomi-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
  })
  export class MenuComponent implements OnInit {
      
    constructor(
      public menuProvider:MenuService,
      public router:Router,
    ) {}
  
    ngOnInit(): void {
     

    }
  }
  