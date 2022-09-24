import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'lomii-reintegrate-order',
  templateUrl: './reintegrate-order.component.html',
  styleUrls: ['./reintegrate-order.component.scss'],
})
export class ReintegrateOrderComponent implements OnInit {
  
  
  constructor(
    private bottomSheetRef:MatBottomSheetRef<ReintegrateOrderComponent>,
  ) { 
  }

  ngOnInit(): void {}

  closeModal(result = ''){
    this.bottomSheetRef.dismiss({
      result
    })
  }
}
