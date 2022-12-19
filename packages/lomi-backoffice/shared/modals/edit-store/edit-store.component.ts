import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { environment } from 'packages/lomi-backoffice/src/environments/environment';
import { Order } from 'packages/lomi-backoffice/types/orders';
import { SpreeStockLocationResource } from 'packages/lomi-backoffice/types/resources';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'lomii-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss'],
})
export class EditStoreComponent implements OnInit {
  public form:any;
  public geocoding = false;
  public estimating = false;

  constructor(
    public dialogRef: MatDialogRef<EditStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public store: SpreeStockLocationResource,
    private formBuilder: FormBuilder,
    private afs: Firestore,
    private httpClient: HttpClient
  ) {}

  updateStore(){
    updateDoc(doc(this.afs,  'backoffice-app/resources'),({
      [this.store.id]: {
        ...this.store,
        ...this.form.value
      }
    })).then(()=>{
      this.dialogRef.close()
    })
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      "address": new FormControl(this.store.address),
      "address2": new FormControl(this.store.address2),
      "name": new FormControl(this.store.name),
      "phone": new FormControl(this.store.phone),
      "notes": new FormControl(this.store.notes),
      "email": new FormControl(this.store.email),

    })
  }
}
