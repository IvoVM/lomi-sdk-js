  import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Journey } from 'packages/lomi-backoffice/types/orders';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'lomii-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.scss'],
})
export class JourneysComponent implements OnInit {

  public journeysToShow:Journey[] = []

  private journeysUnsubscribable:Unsubscribable | null = null;

  constructor(
    private store: Store<BackofficeState>,
  ) {}

  ngOnInit(): void {
    this.journeysUnsubscribable = this.store.select('journeys').subscribe((journeys:any)=>{
      this.journeysToShow = Object.values(journeys.entities)
    })
  }

  ngOnDestroy(): void {
    if(this.journeysUnsubscribable){
      this.journeysUnsubscribable.unsubscribe()
    }
  }
}
