import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `${environment.strapiUrl}/api`;
  private http = inject(HttpClient);

  private handleError(error: HttpErrorResponse) {
    console.error('API error:', error);
    return throwError(() => new Error(error.error || 'An error occurred.'));
  }

  trackOrder(orderId: number) {
    return this.http
      .get<any>(
        `${this.baseUrl}/orders?filters[orderId][$eq]=${orderId}&populate=*`
      )
      .pipe(catchError(this.handleError));
  }

  getAssignedShipment(driverId: number): Observable<any> {
    return this.http
      .get<any>(
        `${this.baseUrl}/shipments?filters[shipmentId][$eq]=${driverId}&populate=*`
      )
      .pipe(catchError(this.handleError));
  }

  updateShipmentStatus(
    driverId: number,
    status: string,
    lat?: number,
    lon?: number
  ): Observable<any> {
    const data = {
      shipmentStatus: status,
      latitude: lat,
      longitude: lon,
    };
    const shipmentId = driverId;
    return this.http
      .get<any>(
        `${this.baseUrl}/shipments?filters[shipmentId][$eq]=${shipmentId}`
      )
      .pipe(
        switchMap((response) => {
          const shipment = response.data[0];
          return this.http.put(`${this.baseUrl}/shipments/${shipment.id}`, {
            data,
          });
        })
      )
      .pipe(catchError(this.handleError));
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}${endpoint}`, data, {
        params: { populate: '*' },
      })
      .pipe(catchError(this.handleError));
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
