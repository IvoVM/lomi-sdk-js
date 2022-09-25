import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { BackofficeState, selectState0 } from 'packages/lomi-backoffice/ngrx';
import { selectAll } from 'packages/lomi-backoffice/ngrx/reducers/orders.reducer';
import { ON_PICKING_STATE, PENDING_STATE, WAITING_AT_DRIVER_STATE, SCHEDULED_STATE, FAILED } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { Journey, OnPickingOrder, Order, PendingOrder } from 'packages/lomi-backoffice/types/orders';
import { DeliveryOperatorSelectorComponent } from '../components/delivery-operator-selector/delivery-operator-selector.component';
import { PickerSelectComponent } from '../picker-select/picker-select.component';
import * as OrderStates from '../../providers/lomi/mocks/states.mock';
import { Timestamp } from 'firebase/firestore';
import { EntityState } from '@ngrx/entity';
import { ConfirmModalComponent } from 'packages/lomi-backoffice/shared/components/modals/confirm-modal/confirm-modal.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UtilsTime } from 'packages/lomi-backoffice/shared/utils/dateTime';
import { ReintegrateOrderComponent } from '../components/reintegrate-order/reintegrate-order.component';
@Component({
  selector: 'lomii-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {

  public secondsToWarning = 24 * 60 * 60;
  public secondsToAlert = 7 * 60 * 60;
  public orderStates = OrderStates
  public columnsToDisplay = ['number', 'name', 'completed_at', 'actions', 'cabify_estimated'];
  public commonColumns = ['name'];
  public journeys: EntityState<Journey> = {
    entities: {},
    ids: []
  };
  checkedSlide!: boolean
  hourToDelivery: any = []
  completedAt: any = []
  timeNow: any
  timeLeft: any = [{}]
  totalTime: any = [{}]
  @Input() state: any = null;
  @Output() recordsFetched = new EventEmitter<number>();

  componentOrders: any = []


  constructor(
    public ordersProvider: OrdersService,
    private _bottomSheet: MatBottomSheet,
    private store: Store<BackofficeState>,
  ) {

  }

  get currentTime() {
    return new Date().getTime()
  }

  showItems(orderId: string) {
    window.open('https://lomi.cl/admin/orders/' + orderId + '/invoice', "_blank")
    this.ordersProvider.updateOrder(orderId, {
      status: PENDING_STATE
    })
    this.ordersProvider.currentStep++
  }

  pickOrder(order: Order) {
    this.ordersProvider.updateOrder(order.number, {
      status: WAITING_AT_DRIVER_STATE
    })
    this.ordersProvider.setCabifyEstimated(order)
    this.ordersProvider.setUberEstimated(order)
    this.ordersProvider.currentStep++
  }

  completeOrder(order: Order) {
    this._bottomSheet.open(ConfirmModalComponent, {
      data: { title: `¿Fué retirado el pedido por ${order.email}?` }
    }).afterDismissed().subscribe((response) => {
      if (response.result === 'confirm') {
        this._bottomSheet.open(PickerSelectComponent, {
          data: { orderNumber: order.number, stockLocation: order.shipment_stock_location_id, buttonText: 'y completar' }
        }).afterDismissed().subscribe((picker) => {
          if (picker) {
            this.ordersProvider.updateOrder(order.number, {
              status: OrderStates.FINISHED_STATE
            })
            this.ordersProvider.currentStep = OrderStates.FINISHED_STATE
          } else this.checkedSlide = false
        })
      } else this.checkedSlide = false
    })

  }

  reintegrate(order: Order) {
    this._bottomSheet.open(ReintegrateOrderComponent, {
      data: order.name
    })
      .afterDismissed().subscribe((response) => {
        if (response) {

          if (response.result === 'storePicking') {
            this.ordersProvider.updateOrder(
              order.number,
              {
                status: 0,
                reason: ''
              },
              order.shipment_stock_location_id
            )
          } else if (response.result === 'waitingAtDriver') {
            this.ordersProvider.updateOrder(
              order.number,
              {
                status: 4,
                reason: ''
              },
              order.shipment_stock_location_id
            )
          } else if (response.result === 'complete') {
            this.ordersProvider.updateOrder(
              order.number,
              {
                status: 6,
                reason: ''
              },
              order.shipment_stock_location_id
            )
          } else {
            return
          }
        }
      })
  }
  selectPicker(order: PendingOrder) {
    this._bottomSheet.open(PickerSelectComponent, {
      data: { orderNumber: order.number, stockLocation: order.shipment_stock_location_id, buttonText: 'e iniciar' }
    }).afterDismissed().subscribe((picker) => {
      if (picker) {
        this.ordersProvider.updateOrder(order.number, {
          status: ON_PICKING_STATE
        })
        this.ordersProvider.currentStep++
      }
    })
  }

  createTrip(order: any) {
    this._bottomSheet.open(DeliveryOperatorSelectorComponent, {
      data: order
    })
  }

  get actionIcon() {
    switch (this.state) {
      case SCHEDULED_STATE: return 'person_add'
      case PENDING_STATE: return 'person_add'
      case ON_PICKING_STATE: return 'arrow_forward_ios'
      case WAITING_AT_DRIVER_STATE: return 'local_shipping'
      case OrderStates.STORE_PICKING_STATE: return 'slide-toggle'
      case OrderStates.FAILED: return 'autorenew'
    }
    return 'shopping_cart'
  }

  actionFunction(order: Order) {
    console.log(order)
    switch (this.state) {
      case SCHEDULED_STATE: return this.selectPicker(order)
      case PENDING_STATE: return this.selectPicker(order)
      case ON_PICKING_STATE: return this.pickOrder(order)
      case WAITING_AT_DRIVER_STATE: return this.createTrip(order)
      case OrderStates.STORE_PICKING_STATE: return this.completeOrder(order)
      case OrderStates.FAILED: return this.reintegrate(order)
    }
    console.log(this.state, "state",)
    return this.showItems
  }

  get actions() {
    switch (this.state) {
      case SCHEDULED_STATE: return ['selectPicker']
      case PENDING_STATE: return ['selectPicker']
      case ON_PICKING_STATE: return ['pickOrder']
      case WAITING_AT_DRIVER_STATE: return ['createTrip']
      case OrderStates.STORE_PICKING_STATE: return ['completeOrder']
      case OrderStates.FAILED: return ['reintegrate']
    }
    return []
  }

  getJourneys() {
    this.store.select("journeys").subscribe((journeys: EntityState<Journey>) => {
      this.journeys = journeys
    })
  }

  getJourneyByOrderNumber(orderNumber: string) {
    return Object.values(this.journeys.entities).find((journey: any) => {
      return journey.orderNumber == orderNumber
    })
  }


  ngOnInit(): void {
    console.log(this.state, "state")
    if (this.state != OrderStates.WAITING_AT_DRIVER_STATE) this.columnsToDisplay.pop()
    if (this.state == OrderStates.DELIVERING_ORDER_STATE) {
      this.getJourneys()
      this.columnsToDisplay.push("state")
    }
    if (this.state == OrderStates.FAILED) this.columnsToDisplay.push('reason')
    if (this.state == OrderStates.STORE_PICKING_STATE || this.state == this.orderStates.PENDING_STATE) this.columnsToDisplay.splice(3, 0, 'total_time')
    if (this.state == OrderStates.SCHEDULED_STATE) {
      this.columnsToDisplay.splice(3, 0, 'scheduled_at', 'left_to')
    }
    if (this.state == undefined) {
      this.columnsToDisplay = ["number", "name", "completed_at", "state"]
    }

    this.getJourneys()

    const selector = selectState0(this.state)
    this.store.pipe(
      selector
    ).subscribe((orders) => {
      if (orders) {
        this.componentOrders = orders
        this.componentOrders.forEach((order: Order, index: number) => {
          if (order && !order.completed_at?.seconds) {
            this.ordersProvider.updateOrder(
              order.number,
              {
                completed_at: Timestamp.fromDate(new Date(order.completed_at as any))
              },
              order.shipment_stock_location_id)
          }

          if (order.scheduled_at) this.hourToDelivery[index] = new Date(order.scheduled_at).getTime()
          if (order.completed_at) this.completedAt[index] = order.completed_at.seconds
        })
        this.recordsFetched.emit(orders.length)
      }
    })
  }

  ngAfterViewInit(): void {
    const hoursToPickUp = 72
    setInterval(() => {
      if (this.hourToDelivery.length > 0) {
        this.hourToDelivery.forEach((element: any, index: number) => {
          this.timeLeft[index] = UtilsTime.getTimeDiff(element)
        });
      }
      if (this.completedAt.length > 0) {
        this.completedAt.forEach((element: any, index: number) => {
          this.totalTime[index] = UtilsTime.getTotalTime(element)
          if (this.totalTime[index].totalHours >= hoursToPickUp && this.state == this.orderStates.STORE_PICKING_STATE && this.componentOrders[index]) {
            this.ordersProvider.updateOrder(
              this.componentOrders[index].number,
              {
                status: 7,
                reason: `Retiro fallido`
              },
              this.componentOrders.shipment_stock_location_id
            )
          }
        })
      }
    }, 1000)
  }
}
