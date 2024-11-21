import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private ipGeoUrl = 'https://ipinfo.io?token=88a2c086191d8d';

  constructor(private http: HttpClient) {}

  getCurrentLocation(): Observable<{ lat: number; lon: number }> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            observer.complete();
          },
          (error) => {
            console.error('Geolocation failed:', error);
            this.getLocationFromIP(observer);
          }
        );
      } else {
        this.getLocationFromIP(observer);
      }
    });
  }

  private getLocationFromIP(observer: any): void {
    this.http
      .get<{ loc: string }>(this.ipGeoUrl)
      .pipe(
        catchError((error) => {
          observer.error('Unable to retrieve location from IP.');
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            const [lat, lon] = response.loc.split(',');
            observer.next({
              lat: parseFloat(lat),
              lon: parseFloat(lon),
            });
            observer.complete();
          } else {
            observer.error('IP geolocation failed.');
          }
        },
      });
  }
}
