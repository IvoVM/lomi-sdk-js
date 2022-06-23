import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Menu } from 'packages/lomi-material/types/menu';

@Injectable({
    providedIn: 'root'
  })
  export class MenuService {


    public menu: Menu[] = []    
  
    constructor(
        db: AngularFireDatabase,
        activatedRoute: ActivatedRoute,
        ) {
        const realTimeMenu = db.list('menu').valueChanges();

        realTimeMenu.subscribe((menu:any)=>{
          this.menu = menu
        })
    }
  }
  