import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { StockLocation } from '../types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class StockLocationsService {
  private apiUrl = 'https://lomi.cl/api/v2/storefront';
  private stockLocationsSubject = new BehaviorSubject<any[]>([]);
  stockLocations$ = this.stockLocationsSubject.asObservable();
  stockLocations: StockLocation[] = [];

  constructor(private http: HttpClient) {
    this.fetchStockLocations();
  }

  fetchStockLocations() {
    this.http
      .get(this.apiUrl + '/stock_locations')
      .pipe(
        map((response: any) => {
          if (response.data && Array.isArray(response.data)) {
            const locations = response.data.map((item: any) => ({
              value: item.attributes.id,
              viewValue: item.attributes.name,
            }));
            this.stockLocations = locations;
            return locations;
          } else {
            console.error('La respuesta no tiene la estructura esperada.');
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error en la solicitud HTTP:', error);
          return of([]); // En caso de error, retornar un array vacío
        })
      )
      .subscribe((locations) => {
        // Llama al método setStockLocations para establecer el array en el servicio compartido
        this.setStockLocations(locations);
      });
  }
  setStockLocations(locations: StockLocation[]) {
    this.stockLocationsSubject.next(locations);
  }

  getUsersLocation(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(this.apiUrl + '/account', { headers }).pipe(
      map((response) => {
        if (response.data.attributes.stock_locations[0]) {
          return response.data.attributes.stock_locations[0];
        } else {
          return '52';
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return of('52');
      })
    );
  }

  findStockLocationById(
    id: string,
    ArrayLocations: Array<StockLocation> = this.stockLocations
  ) {
    const stockLocationFounded = ArrayLocations.find(
      (stockLocation) => stockLocation.value === JSON.parse(id)
    );
    if (stockLocationFounded) {
      return stockLocationFounded;
    } else {
      throw new Error('No se encontró ningúna StockLocation con ese id.');
    }
  }

  saveStockLocation(stockLocation: StockLocation) {
    localStorage.setItem('stockLocation', JSON.stringify(stockLocation));
  }

  getLocalStorageLocation() {
    const storedLocation = localStorage.getItem('stockLocation');
    if (storedLocation) {
      try {
        return JSON.parse(storedLocation);
      } catch (error) {
        console.error('Error al analizar el valor almacenado:', error);
        return { id: '49', actualLocation: 'Da Carla' };
      }
    } else {
      return { id: '49', actualLocation: 'Da Carla' };
    }
  }
}
