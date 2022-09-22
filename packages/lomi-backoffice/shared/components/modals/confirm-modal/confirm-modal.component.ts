import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'lomii-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {


  constructor(
    private bottomSheetRef:MatBottomSheetRef<ConfirmModalComponent>,
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
