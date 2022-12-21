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
    "rider cancel": "Cancelado",
    "hire": "Buscando un repartidor",
    "qualifiedforpickup": "Buscando un repartidor",
    "onroutetopickup": "El repartidor esta camino a la tienda",
    "pickingup": "El repartidor esta recogiendo el pedido",
    "intransit": "En camino a despacho",
    "delivering": "El repartidor llego a destino",
    "returning": "Devolviendo el pedido a la tienda",
    "incident": "Incidente",
    "requestercancel": "Cancelado por Tienda",
    "internalcanceled": "Cancelado por Cabify",
    "pickupfailed": "No se pudo recoger el pedido",

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