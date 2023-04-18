import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RipleyService } from '../products-list/ripley.service';

@Component({
  selector: 'lomii-csv-modal',
  templateUrl: './csv-modal.component.html',
  styleUrls: ['./csv-modal.component.scss'],
})
export class CsvModalComponent implements OnInit {
  products:any = [];

  constructor(
    private ripley: RipleyService ,
    @Inject(MAT_DIALOG_DATA) public data: {
    taxons: Array<any>,
    attributes: Array<any>,
  }) {
    data.taxons.forEach(taxon => {    
      this.ripley.getSpreeCategories(taxon).then((categories:any)=>{
        this.products = [...this.products, ...categories.map(this.mapAttributes)]
      })
    });
  }

  mapAttributes(data:any){
    return {
      "Titulo" : data.attributes.name,
      "Descripcion" : data.attributes.description,
      "variant_id": data.relationships.variants.data[0].id
    }
  }

  ngOnInit(): void {
    console.log(this.data.taxons, this.data.attributes); 
  }
}