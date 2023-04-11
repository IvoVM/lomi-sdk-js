import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RipleyService {

  public miraklAttributes = []

  async getRequiredAttributesFromMirakl() {
    this.httpClient.get("https://ripley-prod.mirakl.net/api/products/attributes?shop_id=9064", {
      headers: {
        "Authorization":  "0598fcf3-7d18-420f-8e5c-380ae73b0651"
      }
    }).subscribe((data:any)=>{
      this.miraklAttributes = data
      console.log(this.miraklAttributes)
    }, (error:any)=>{
      console.log(error, "error")
    })
  }

  constructor(private httpClient: HttpClient) {
    this.getRequiredAttributesFromMirakl()
  }
}
