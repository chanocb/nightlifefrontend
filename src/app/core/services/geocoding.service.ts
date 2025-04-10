import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private readonly apiUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=';

  constructor(private readonly http: HttpClient) {}

  // Método para obtener las coordenadas a partir de una dirección
  getCoordinates(address: string): Observable<any> {
    const url = `${this.apiUrl}${encodeURIComponent(address)}`;
    return this.http.get<any>(url);
  }
}