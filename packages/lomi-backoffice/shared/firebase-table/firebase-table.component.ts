import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lomii-firebase-table',
  templateUrl: './firebase-table.component.html',
  styleUrls: ['./firebase-table.component.scss'],
})
export class FirebaseTableComponent implements OnInit {

  @Input() valuesToShow: any[] = [];
  @Input() dataSource: any[] = [];
  @Input() linkToRecordId: boolean = false;
  @Input() linkToRecordIdRoute: string = "";

  constructor() {}

  preventDefault(event: Event) {
    event.stopPropagation()
  }

  ngOnInit(): void {
    
  }
}
