import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'lomii-pickers-modal',
  templateUrl: './pickers-modal.component.html',
  styleUrls: ['./pickers-modal.component.scss'],
})
export class PickersModalComponent implements OnInit {

  pickerName: string = ''
  inputError: string = ''
  public pickers$= new BehaviorSubject<any []>([])
  public pickers: any;
  public selectedPicker: any = null;
  constructor(
    public dialogRef: MatDialogRef<PickersModalComponent>,
    private firestore: Firestore
  ) {
    this.pickers$.subscribe((pickers) => {
      this.pickers = pickers
    })
  }

  ngOnInit(): void {
    this.getPickers()
  }

  async registerPicker(): Promise<string | void> {
    if (!this.pickerName) return this.inputError = 'El picker es requerido'
    let isUnisque = this.pickers.filter((p: any) => p.name.toLowerCase() === this.pickerName.toLowerCase())
    if (isUnisque.length > 0) return this.inputError = 'El picker ya existe'
    const docRef = await addDoc(collection(this.firestore, 'pickers'), {
      name: this.pickerName
    });
    if (docRef.id) return this.pickerName = '', this.inputError = ''
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

  async deletePicker(picker: any): Promise<any> {
    await deleteDoc(doc(this.firestore, 'pickers', picker.id));
  }
}
