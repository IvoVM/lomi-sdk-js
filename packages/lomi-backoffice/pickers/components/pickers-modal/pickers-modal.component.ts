import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { App } from 'packages/lomi-backoffice/types/app';
import { UserRol } from 'packages/lomi-backoffice/types/user';
import { BehaviorSubject, map,  } from 'rxjs';
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
    this.store.select('user').subscribe((user:any)=>{
      this.user = user
    })
    this.store.select('app').subscribe((app:App)=>{
      this.rols = app.userRols
    })
    const filterStore = this.rols.filter((rol: UserRol) => rol.id === this.user.userRol).map((userMergeRol: any) => userMergeRol.stockLocationId)
    this.stores = Object.values(storesMock)
    if (+filterStore != -1) this.stores = Object.values(storesMock).filter((stores: any) => stores.value == +filterStore)
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
