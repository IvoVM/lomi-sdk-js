import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { currentUserSelector } from 'packages/lomi-backoffice/ngrx/reducers/user.reducer';
import { UserRol } from 'packages/lomi-backoffice/types/user';
import { BehaviorSubject, } from 'rxjs';
import { storesMock } from '../../../providers/lomi/mocks/stores.mock'

@Component({
  selector: 'lomii-pickers-modal',
  templateUrl: './pickers-modal.component.html',
  styleUrls: ['./pickers-modal.component.scss'],
})
export class PickersModalComponent implements OnInit {

  public rols:UserRol[] = []
  public user:any;
  pickerName: string = ''
  storeId!: number 
  inputError: string = ''
  storeError: string = ''
  public pickers$= new BehaviorSubject<any []>([])
  public pickers: any;
  public selectedPicker: any = null;
  stores: any

  constructor(
    public dialogRef: MatDialogRef<PickersModalComponent>,
    private firestore: Firestore,
    private store: Store<BackofficeState>  
    ) {
    this.pickers$.subscribe((pickers) => {
      this.pickers = pickers
    })
  }

  ngOnInit(): void {
    this.getPickers()
    this.store.select(currentUserSelector).subscribe((user:any)=>{
      if (user) this.user = user
    })
    this.stores = Object.values(storesMock)
    if (+this.user.stockLocationId != -1) this.stores = Object.values(storesMock).filter((stores: any) => stores.value == +this.user.stockLocationId)
  }

  async registerPicker(): Promise<string | void> {
    if (!this.pickerName) return this.inputError = 'El picker es requerido'
    this.inputError = ''
    if (!this.storeId) return this.storeError = 'La tienda es requerida'
    this.storeError = ''
    let isUnisque = this.pickers.filter((p: any) => p.name.toLowerCase() === this.pickerName.toLowerCase())
    if (isUnisque.length > 0) return this.inputError = 'El picker ya existe'
    const docRef = await addDoc(collection(this.firestore, 'pickers'), {
      name: this.pickerName,
      store: this.storeId
    });
    if (docRef.id) {
      this.pickerName = '' 
      this.storeId = 0
      this.dialogRef.close()
    }
  }

  async getPickers(): Promise<void> {
    const q = query(collection(this.firestore, 'pickers'))
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

}
