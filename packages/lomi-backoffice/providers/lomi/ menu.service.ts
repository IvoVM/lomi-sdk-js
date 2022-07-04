import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Menu } from '../../types/menu';

@Injectable({
    providedIn: 'root'
  })
  export class MenuService {

    public menu: Menu[] = [
      {
        name: "Dashboard",
        icon: "dashboard",
        route:"/dashboard"
      },
      {
        name: "Ordenes",
        icon: "shopping_bag",
        route:"/orders"
      }
    ]    
  
    constructor(
        db: AngularFireDatabase,
        activatedRoute: ActivatedRoute,
        ) {
        const realTimeMenu = db.list('menu').valueChanges();

        realTimeMenu.subscribe((menu:any)=>{
          //this.menu = Backoffice has a static menu for now
        })
    }
  }
  