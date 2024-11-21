import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);

  register(username: string, email: string, password: string): Observable<any> {
    return this.apiService.post('/auth/local/register', {
      username,
      email,
      password,
    });
  }

  login(identifier: string, password: string): Observable<any> {
    return this.apiService.post('/auth/local', { identifier, password });
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    localStorage.removeItem('authToken');
  }
}
