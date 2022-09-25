import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'lomii-reintegrate-order',
  templateUrl: './reintegrate-order.component.html',
  styleUrls: ['./reintegrate-order.component.scss'],
})
export class ReintegrateOrderComponent implements OnInit {
  
  
  constructor(
    private bottomSheetRef:MatBottomSheetRef<ReintegrateOrderComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) { 
  }

  ngOnInit(): void {}

  closeModal(result = ''){
    this.bottomSheetRef.dismiss({
      result
    })
  }
}
