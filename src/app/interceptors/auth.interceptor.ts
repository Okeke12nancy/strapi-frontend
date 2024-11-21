import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.apiService.getAuthToken();

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
