import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ripley } from '@lomi-sdk/lomi-sdk'
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { CsvModalComponent } from '../csv-modal/csv-modal.component';


@Injectable({
  providedIn: 'root'
})
export class RipleyService {

  public miraklAttributes:any = []
  public miraklHierarchies:any = []
  public miraklRootCategories:any = []
  public miraklOrders:any = []

  async getRipleyOrders(params = {}){
    return ripley.getRipleyOrders().then((orders:any)=>{
      this.miraklOrders = orders.orders
      console.log(this.miraklOrders, "this.miraklOrders")
    })
  }

  async getRequiredAttributesFromMirakl() {
    ripley.getRipleyAttributes().then((attributes:any)=>{
      this.miraklAttributes = attributes.attributes
      console.log(this.miraklAttributes, "this.miraklAttributes")
    })
  }

  public async getSpreeCategories(taxons:any){
    return new Promise((resolve, reject)=>{
      this.httpClient.get("https://lomi.cl/api/v2/storefront/products?filter[taxon]="+taxons).subscribe((data:any)=>{
        resolve(data.data)
      })
    })
  }

  public async openCsvDialog(taxons:any, attributes:any) {
    this.dialog.open(CsvModalComponent, {
      data:{
        taxons,
        attributes
      }
    });
  }

  async getRipleyHierarchies(params = {}){
    ripley.getRipleyHierarchies().then((hierarchies:any)=>{
      this.miraklHierarchies = hierarchies.hierarchies
      this.miraklHierarchies.forEach((hierarchy:any)=>{
        hierarchy.attributes = this.miraklAttributes.filter((attribute:any)=>{
            return attribute.hierarchy_code === hierarchy.code || !attribute.hierarchy_code
          })
      })
      this.miraklRootCategories = hierarchies.hierarchies.filter((hierarchy:any)=>{
        return hierarchy.level === 3 && hierarchy.parent_code == "R060000000000"
      })
      this.miraklRootCategories.forEach((rootCategory:any)=>{
        rootCategory.children = this.miraklHierarchies.filter((hierarchy:any)=>{
          return hierarchy.level === 4 && hierarchy.parent_code === rootCategory.code
        })
      })
      this.miraklRootCategories.forEach((rootCategory:any)=>{
        rootCategory.children.forEach((child:any)=>{
          child.children = this.miraklHierarchies.filter((hierarchy:any)=>{
            return hierarchy.level === 5 && hierarchy.parent_code === child.code
          })
          child.children.forEach((child2:any)=>{
            child2.children = this.miraklHierarchies.filter((hierarchy:any)=>{
              return hierarchy.level === 6 && hierarchy.parent_code === child2.code
            })
          })
        })
      })
      console.log(this.miraklHierarchies, "this.miraklHierarchies")
      console.log(this.miraklRootCategories, "this.miraklRootCategories")
    })
  }

  constructor(private httpClient: HttpClient, private dialog:MatDialog) {
    this.getRequiredAttributesFromMirakl()
    this.getRipleyHierarchies()
    this.getRipleyOrders()
  }
}
