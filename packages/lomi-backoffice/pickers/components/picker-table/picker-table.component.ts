import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, onSnapshot, query, startAt, orderBy, limit, startAfter, deleteDoc, doc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { storesMock } from '../../../providers/lomi/mocks/stores.mock'
@Component({
  selector: 'lomii-picker-table',
  templateUrl: './picker-table.component.html',
  styleUrls: ['./picker-table.component.scss'],
})
export class PickerTableComponent implements OnInit {

  public columnsToDisplay = ['name',  'store', 'delete']
  public pickers$= new BehaviorSubject<any []>([])
  pickers: any

  constructor(
    private firestore:Firestore,
  ) {
    this.pickers$.subscribe((pickers) => {
      this.pickers = pickers
      this.pickers.forEach((element: any, index: number) => {
        let storeName = Object.values(storesMock)
        .filter((store: any) => store.value == element.store)
        .map((store: any) => store.county)
        if (storeName.length > 0) this.pickers[index].storeName = storeName[0]
      });
    })
  }

  ngOnInit(): void {
    this.getPickers()
  }

  async getPickers(lastPicker?: string, perPage: number = 5): Promise<void> {
    const q = query(collection(this.firestore, 'pickers'), orderBy('name'), startAfter(lastPicker ? lastPicker: ''), limit(perPage))
    onSnapshot(q, { includeMetadataChanges: true } , (snapShotResponse) => {
      let responseArray: any = []
      snapShotResponse.forEach((doc) => {
        responseArray.push({
          id: doc.id,
          ...doc.data()
        })
      })
      this.pickers$.next(responseArray)
    })
  }

  changePerPage(perPage: number) {
    this.getPickers('', perPage)
  }

  async deletePicker(picker: any): Promise<any> {
    await deleteDoc(doc(this.firestore, 'pickers', picker.id));
  }
}
