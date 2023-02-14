import { Component, Input, OnInit } from '@angular/core';
import { normalizePhone } from 'packages/lomi-backoffice/shared/functions/utils';
import { Order } from 'packages/lomi-backoffice/types/orders';

type Incident = {
  name: string,
  description: string,
  icon: string,
}

@Component({
  selector: 'lomii-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss'],
})
export class IncidentComponent implements OnInit {

  @Input() type = "condensed-info"
  @Input() order: Order | undefined

  incidents:Incident[] = []




phoneValidation(phoneNumber:any){
    if(phoneNumber.startsWith("+56") && phoneNumber.length == 12){
      return true
    }
    return false
  }

  detectIncidents(){
    if(this.order?.ship_address_phone && !(this.phoneValidation(normalizePhone(this.order?.ship_address_phone)))){
      this.incidents.push({
        name: "telefono malo",
        description: "El telefono del usuario no respeta el formato valido para un numero de Chile",
        icon: "phone"
      })
    }
  }

  constructor() {}

  ngOnInit(): void {
    this.detectIncidents()
  }
}
