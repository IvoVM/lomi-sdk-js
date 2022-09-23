import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { PickersModalComponent } from '../pickers-modal/pickers-modal.component'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { collection, onSnapshot, query, deleteDoc, doc, orderBy, where } from 'firebase/firestore';
import { storesMock } from '../../../providers/lomi/mocks/stores.mock'
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { Store } from '@ngrx/store';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ConfirmModalComponent } from 'packages/lomi-backoffice/shared/components/modals/confirm-modal/confirm-modal.component';


@Component({
  selector: 'lomii-picker-table',
  templateUrl: './picker-table.component.html',
  styleUrls: ['./picker-table.component.scss'],
})
export class PickerTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<any>;
  public columnsToDisplay = ['name', 'store', 'delete']
  user:any;

  constructor(
    private firestore: Firestore,
    public dialog: MatDialog,
    private store: Store<BackofficeState>  ,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void { }


  ngAfterViewInit() {
    this.store.select(currentUserSelector).subscribe((user:any)=>{
      if (user) this.user = user
      const filterByStore = where('store','==',this.user.stockLocationId)
      const orderByStore = orderBy('store')
      const q = query(collection(this.firestore, 'pickers'), this.user.stockLocationId != '-1' ? filterByStore: orderByStore)
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
    })
  }
  
    deletePicker(picker: any): void {
    this._bottomSheet.open(ConfirmModalComponent, {
      data: { title: `¿Quieres eliminar a ${picker.name}?` }
    }).afterDismissed().subscribe(async (response) => {
      if (response.result === 'confirm') {
        await deleteDoc(doc(this.firestore, 'pickers', picker.id));
      } 
    })
  }

  openPickersDialog(): void {
    this.dialog.open(PickersModalComponent, {
    })
  }
}
