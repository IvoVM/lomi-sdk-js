import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Observable, take } from 'rxjs';
import { query, orderBy, limit } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { storesMock } from './mocks/stores.mock';
import { statesMock } from './mocks/states.mock';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import * as OrderActions from '../../ngrx/actions/orders.actions'
import { ChangeStockLocation } from 'packages/lomi-backoffice/ngrx/actions/app.actions';
import { App } from 'packages/lomi-backoffice/types/app';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public filters: {
    stockLocationId: number;
  } = {
    stockLocationId: 1,
  };
  public orders: any[] = [];
  public pendingOrders: any[] = [];
  public completedOrders: any[] = [];
  private ordersRef: any;
  public orders$: any;
  public loadingOrders = true;
  public currentStep = 0;

  //For dynamic change, should be connected to firestore
  public states = statesMock;
  public stores = storesMock

  get storeName(){
    return this.stores[this.filters.stockLocationId].name
  }

  activatedFilters: any = [];

  public booleanFilters: any = [
    {
      name: 'Pedidos completados',
      action: this.completedFilter,
    },
  ];

  completedFilter(order: any) {
    return order.hermexOrder
      ? order.status.id == 8
      : order.journey_state == 'drop off' ||
          order.journey_state == 'withdrawaled';
  }

  doFilter(filter: any) {
    this.orders = this.orders.filter(filter.action);
    this.activatedFilters.push(filter);
  }

  constructor(
    db: AngularFireDatabase,
    activatedRoute: ActivatedRoute,
    private firestore: Firestore,
    private httpClient: HttpClient,
    private ngrxStore: Store<BackofficeState>,
  ) {
    this.ngrxStore.select('orders').subscribe((orders)=>{
      this.loadingOrders = orders.loading
    })
    const saveStockLocationId = localStorage.getItem('stockLocationId')
    if (saveStockLocationId){
      this.filters.stockLocationId = parseInt(saveStockLocationId)
    } else {
      this.filters.stockLocationId = 1
    }
  }

  updateStockLocation(stockLocationId: number) {
    this.filters.stockLocationId = stockLocationId;
    this.ngrxStore.dispatch(new ChangeStockLocation(stockLocationId))
    this.ngrxStore.dispatch(new OrderActions.Query({
      stock_location_id: this.filters.stockLocationId
    }))

  }

  updateOrder(orderId: string, updateRecord: any, stock_location_id = this.filters.stockLocationId) {
    console.log('SPREE_ORDERS_' + stock_location_id + '/' + orderId);
    const document = doc(
      this.firestore,
      'SPREE_ORDERS_' + this.filters.stockLocationId + '/' + orderId
    );
    updateDoc(document, updateRecord);

  }

  getOrder(orderId: string) {
    const stockLocation = localStorage.getItem('stockLocationId');
    const orderDoc = doc(
      this.firestore,
      'SPREE_ORDERS_' + stockLocation + '/' + orderId
    );
    return getDoc(orderDoc);
  }

  getOrdersData() {
    this.loadingOrders = true;
    if (this.orders$?.unsubscribe) {
      this.orders$.unsubscribe();
    }

    this.ordersRef = collection(
      this.firestore,
      'SPREE_ORDERS_' + this.filters.stockLocationId
    );
    const q = query(
      this.ordersRef,
      orderBy('completed_at', 'desc'),
      limit(100)
    );
    this.orders$ = collectionData(q) as Observable<any[]>;
    this.orders$.subscribe((orders: any) => {
      this.loadingOrders = false;
      console.log(orders);
      this.orders = orders;
      this.orders.forEach((order) => {
        order.badges = [];
        if (order.name.includes('Retiro en')) {
          order.badges.push({ abreviation: 'RT', color: 'green' });
        } else if (order.hermexOrder) {
          console.log(order);
          order.badges.push({ abreviation: 'Hmx', color: 'teal' });
        } else if (order.journey_state) {
          order.badges.push({ abreviation: 'CAB', color: 'purple' });
        }
      });
    });
  }

  setCabifyEstimated(order:any){
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/evaluateCabify",order)
    req.subscribe((res)=>{
      console.log(res)
    })
  }

  setUberEstimated(order:any){
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/evaluateUber",order)
    const reqFourWheels = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/evaluateFourWheelsUber",order)
    req.subscribe((res)=>{
      console.log(res)
    })

    reqFourWheels.subscribe((res)=>{
      console.log(res)
    })
  }

  createUberTrip(order: any) {
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/creatUberTrip",order)
    return req
  }

  createFourWheelsUberTrip(order: any) {
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/creatFourWheelsUberTrip",order)
    return req
  }

  cancelUberFourWheelsTrip(tripId:string, DEBUG = false){
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/cancelFourWheelsUberTrip",{
      tripId: tripId
    })
    return req
  }

  cancelUberTrip(tripId:string, DEBUG = false){
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/cancelUberTrip",{
      tripId: tripId
    })
    return req
  }

  cancelHermexTrip(order:any){
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/cancelHmxTrip", order)
    return req
  }

  createHermexTrip(order: any) {
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/createHmxTrip",order)
    return req
  }

  createCabifyTrip(order: any) {
    order.stops = order.stops.reverse()
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/createCabifyTripEndpoint",order)
    return req
  }

  cancelCabifyTrip(order: any) {
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/cancelCabifyTripEndpoint",order)
    return req
  }

  refreshUberTrips(order:any) {
    console.log(order)
    const req = this.httpClient.post("https://us-central1-lomi-35ab6.cloudfunctions.net/refresUberTrip",order)
    req.subscribe((res)=>{
      order.uberTrips = res
      console.log(res)
    }, (err)=>{
      console.log(err)
    })
  }

  getOrderByNumber(orderNumber: string) {
    console.log(this.orders);
    return this.orders.find((order) => {
      return order.number == orderNumber;
    });
  }

  stateName(state: any) {
    switch (state) {
      case 'complete':
        return 'Confirmado';
    }
    return state;
  }
}
