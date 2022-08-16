import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
const uberStatus:any = {
    "pending": "Pendiente de confirmacion",
    "accepted": "Aceptado",
    "in_progress": "En camino",
    "completed": "Completado",
    "canceled": "Cancelado",
    "rejected": "Rechazado",
    "returned": "Devuelto a tienda",
}

@Pipe({ 
    name: 'uberStatus' 
})
export class UberStatusPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(status:string) {
    return uberStatus[status];
  }
} 