import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
const uberStatus:any = {
    "pending": "Pendiente de confirmacion",
    "pickup": "El repartido esta en camino a la tienda",
    "dropoff": "El repartidor esta en camino a la direccion de entrega",
    "accepted": "Aceptado",
    "in_progress": "En camino",
    "completed": "Completado",
    "canceled": "Cancelado",
    "rejected": "Rechazado",
    "returned": "Devuelto a tienda",
    "delivered": "Entregado",
}

@Pipe({ 
    name: 'uberStatus' 
})
export class UberStatusPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(status:string) {
    return uberStatus[status] ? uberStatus[status] : status;
  }
} 