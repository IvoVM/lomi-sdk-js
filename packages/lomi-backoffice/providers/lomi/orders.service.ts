import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { query, orderBy, limit } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public filters = {
    stockLocationId: 1,
  };
  public orders: any[] = [];
  public pendingOrders: any[] = [];
  public completedOrders: any[] = [];
  private ordersRef: any;
  public orders$: any;
  public loadingOrders = true;
  public currentStep = 0;
  public states = [
    'Confirmado',
    'Preparando pedido',
    'Listo para el despacho',
    'En despacho',
    'Entregado',
    'Devuelto',
  ];

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
    private httpClient: HttpClient
  ) {
    this.getOrdersData();
  }

  updateOrder(orderId: string, updateRecord: any) {
    const document = doc(
      this.firestore,
      'SPREE_ORDERS_' + this.filters.stockLocationId + '/' + orderId
    );
    updateDoc(document, updateRecord);
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
