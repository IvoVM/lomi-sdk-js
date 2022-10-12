import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { Journey } from 'packages/lomi-backoffice/types/orders';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'lomii-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {



  public cancelingJourney = false;
  private journeyUnsubscribable:Unsubscribable | null = null;
  private journeyId = '';
  public journey:Journey = {
    id: '',
    providerId: 0,
    orderNumber: "",
  }

  constructor(
    private router:Router,
    private store:Store<BackofficeState>,
    private ordersService:OrdersService
    ) {
      this.journeyId = this.router.url.split('/')[2]
    }
    
    ngOnInit(): void {
      this.store
      this.journeyUnsubscribable = this.store.select("journeys").subscribe((journeys:any)=>{
        const journey = journeys.entities[this.journeyId]
        if(journey){
          this.journey = journey
        }
      })
  }

  cancelTrip(){}
  public cancelCabifyJourney(){
    this.cancelingJourney = true;
    this.ordersService.cancelCabifyTrip({tripId: this.journey.id}).subscribe((response:any)=>{
      console.log("response", response)
    })
  }

  ngOnDestroy(){
    if(this.journeyUnsubscribable){
      this.journeyUnsubscribable.unsubscribe()
    }
  }
}
