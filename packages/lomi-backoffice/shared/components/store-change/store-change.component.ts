import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';

@Component({
  selector: 'lomii-store-change',
  templateUrl: './store-change.component.html',
  styleUrls: ['./store-change.component.scss'],
})
export class StoreChangeComponent implements OnInit {

  public stockLocationName = "";

  constructor(
    private store: Store<BackofficeState>
  ) {}

  ngOnInit(): void {
    const stockLocationId = localStorage.getItem("stockLocationId")
    this.stockLocationName = stockLocationId || ""
    this.store.select("app").subscribe((app:any)=>{
      console.log("app", app.resources)
      const store = app.resources.find((store:any)=>store.stockLocationId == stockLocationId)
      if(store){
        this.stockLocationName = store.name
      } else {
        this.stockLocationName = stockLocationId || ""
      }
    })
    }
}
