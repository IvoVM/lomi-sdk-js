import { Component, Inject, Input, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { collection, CollectionReference } from 'firebase/firestore';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'lomii-picker-select',
  templateUrl: './picker-select.component.html',
  styleUrls: ['./picker-select.component.scss'],
})
export class PickerSelectComponent implements OnInit {
  public pickersRef:CollectionReference;
  public pickers$: Observable<any[]>;
  public pickers:any;
  public selectedPicker:any = null;

  constructor(
    private firestore:Firestore,
    private ordersProvider:OrdersService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef:MatBottomSheetRef<PickerSelectComponent>
  ) {
    this.pickersRef = collection(this.firestore, 'pickers');
    this.pickers$ = collectionData(this.pickersRef) as Observable<any[]>
    this.pickers$.subscribe((pickers)=>{
      this.pickers = pickers.filter((store: any) => store.store == this.data.stockLocation)
    })
  }

  selectPicker(){
    this.ordersProvider.updateOrder(this.data.orderNumber,{
      picker: this.selectedPicker
    })
    this.bottomSheetRef.dismiss({
      picker: this.selectedPicker
    })
  }

  ngOnInit(): void {}
}
