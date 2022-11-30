import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { environment } from 'packages/lomi-backoffice/src/environments/environment';
import { Order } from 'packages/lomi-backoffice/types/orders';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'lomii-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit {
  public form:any;
  public geocoding = false;
  public estimating = false;

  constructor(
    public dialogRef: MatDialogRef<EditAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private formBuilder: FormBuilder,
    private afs: Firestore,
    private httpClient: HttpClient
  ) {}

  updateOrder(){
    const orderDocReference = doc(this.afs,  'SPREE_ORDERS_'+this.order.shipment_stock_location_id+"/"+this.order.number)
    updateDoc(orderDocReference, {
      ship_address_address1: this.form.value["address1"],
      ship_address_address2: this.form.value["address2"],
      name: this.form.value["name"],
      ship_address_note: this.form.value["notes"],
      ship_address_phone: this.form.value["phone"]
    }).then(()=>{
      console.log("Geocoding")
      this.geocoding = true;
      this.order.ship_address_address1 = this.form.value["address1"]
      this.httpClient.post(environment.functionsHost+"/geocodeOrder",this.order).subscribe((res:any)=>{
        this.geocoding = false;
        this.estimating = true;
        this.order = res
        combineLatest(
          [
            this.httpClient.post(environment.functionsHost+"/evaluateFourWheelsUber",this.order),
            this.httpClient.post(environment.functionsHost+"/evaluateUber",this.order),
            this.httpClient.post(environment.functionsHost+"/evaluateCabify",this.order)
          ]
        ).subscribe(
          (res) => {
            const [ evaluateUberFourWheels, evaluateUber, evaluateCabify ] = res 
            console.log(evaluateCabify,evaluateUber,evaluateUberFourWheels)
            this.dialogRef.close()
          }
        )
      })
    })
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      "address1": new FormControl(this.order.ship_address_address1),
      "address2": new FormControl(this.order.ship_address_address2),
      "name": new FormControl(this.order.name),
      "notes": new FormControl(this.order.ship_address_note),
      "phone": new FormControl(this.order.ship_address_phone)
    })
  }
}
