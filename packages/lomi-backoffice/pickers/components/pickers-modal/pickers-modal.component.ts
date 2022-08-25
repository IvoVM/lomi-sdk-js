import { Component, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
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

  async registerPIcker(): Promise<any> {
    if (!this.pickerName) return
    const docRef = await addDoc(collection(this.firestore, 'pickers'), {
      name: this.pickerName
    });
    if (docRef.id) return this.pickerName = ''
  }

  async getPickers() {
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

  async deletePicker(picker: any) {
    await deleteDoc(doc(this.firestore, 'pickers', picker.id));
  }
}
