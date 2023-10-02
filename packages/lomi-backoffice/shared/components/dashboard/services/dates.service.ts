import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatesService {
  formatDate(fechaOriginal: string): string {
    const fecha = new Date(fechaOriginal);

    // Obtener  año, mes y día
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1; // Los meses en JavaScript son 0-based
    const day = fecha.getDate();

    // Formatea la fecha según tus especificaciones
    const fechaFormateada = `${year}-${month}-${day}`;
    return fechaFormateada;
  }

  dateRangeValidator(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      return false;
    }
    if (this.verificarFechas(startDate, endDate)) {
      return false;
    }

    return true;
  }

  verificarFechas(fecha1: string, fecha2: string): boolean {
    const fechaActual = new Date();
    const fecha1Date = new Date(fecha1);
    const fecha2Date = new Date(fecha2);

    // Verificar si alguna de las fechas es mayor que la fecha actual
    if (fecha1Date > fechaActual && fecha2Date > fechaActual) {
      console.log('ambas fechas son mayores a la fecha actual');
      return true;
    }
    if (fecha1Date > fechaActual) {
      console.log('startDate es mayor a la fecha actual');
      return true;
    }

    if (fecha2Date > fechaActual) {
      console.log('endDate es mayor a la fecha actual');
      return true;
    }
    return false; // Ninguna fecha es mayor que la fecha actual
  }
  convertirFecha(fecha: string): string {
    // Divide la fecha utilizando el carácter "-"
    const partes = fecha.split('-');

    if (partes.length === 3) {
      const año = partes[0];
      const mes = partes[1];
      const dia = partes[2];

      // Formatea la fecha en el nuevo formato
      return `${dia}/${mes}/${año}`;
    } else {
      // Manejo de error en caso de que la fecha no esté en el formato esperado
      return 'Fecha inválida';
    }
  }

  // Función para obtener la fecha actual en el formato YYYY-M-D
  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Sumamos 1 porque en JavaScript los meses van de 0 a 11
    const day = currentDate.getDate();

    return `${year}-${month}-${day}`;
  }

  // Función para obtener la fecha 2 semanas antes en el formato YYYY-M-D
  getTwoWeeksAgoDate(): string {
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate);
    twoWeeksAgo.setDate(currentDate.getDate() - 14);

    const year = twoWeeksAgo.getFullYear();
    const month = twoWeeksAgo.getMonth() + 1; // Sumamos 1 porque en JavaScript los meses van de 0 a 11
    const day = twoWeeksAgo.getDate();

    return `${year}-${month}-${day}`;
  }
}
