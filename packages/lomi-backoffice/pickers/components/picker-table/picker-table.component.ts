import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { PickersModalComponent } from '../pickers-modal/pickers-modal.component'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { collection, onSnapshot, query, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { storesMock } from '../../../providers/lomi/mocks/stores.mock'


@Component({
  selector: 'lomii-picker-table',
  templateUrl: './picker-table.component.html',
  styleUrls: ['./picker-table.component.scss'],
})
export class PickerTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<any>;

  public columnsToDisplay = ['name', 'store', 'delete']

  constructor(
    private firestore: Firestore,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }


  ngAfterViewInit() {
    const q = query(collection(this.firestore, 'pickers'), orderBy('store'))
    onSnapshot(q, { includeMetadataChanges: true }, (snapShotResponse) => {
      let responseArray: any = []
      snapShotResponse.forEach((doc) => {
        let storeName = Object.values(storesMock)
          .filter((store: any) => store.value == doc.data()['store'])
          .map((store: any) => store.county)
        responseArray.push({
          id: doc.id,
          ...doc.data(),
          storeName: storeName[0]
        })
      })
      this.dataSource = new MatTableDataSource<any>(responseArray);
      this.dataSource.paginator = this.paginator;
    })
  }

  async deletePicker(picker: any): Promise<any> {
    await deleteDoc(doc(this.firestore, 'pickers', picker.id));
  }

  openPickersDialog(): void {
    this.dialog.open(PickersModalComponent, {
    })
  }
}
