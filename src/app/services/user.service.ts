import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  getDriverId(): number | null {
    const user = this.getUserData();
    return user ? user.driverId : null;
  }
}
