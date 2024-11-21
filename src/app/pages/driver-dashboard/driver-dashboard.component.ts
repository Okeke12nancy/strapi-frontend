import { Component, OnInit, inject } from '@angular/core';
import { GeolocationService } from '../../services/geolocation.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrl: './driver-dashboard.component.scss',
})
export class DriverDashboardComponent implements OnInit {
  error: string = '';
  isLoading: boolean = false;
  data: any = null;
  success: string = '';

  isJustRegistered: boolean;

  private geolocationService = inject(GeolocationService);
  private apiService = inject(ApiService);
  private userService = inject(UserService);

  ngOnInit(): void {
    const driverId = this.userService.getDriverId();
    this.isJustRegistered = driverId ? false : true;

    if (!this.isJustRegistered) {
      this.loadAssignedShipment(driverId);
    }
  }

  loadAssignedShipment(driverId: number): void {
    if (!driverId) {
      this.error = 'No driver ID found';
      return;
    }

    this.isLoading = true;
    this.apiService.getAssignedShipment(driverId).subscribe({
      next: (response: any) => {
        this.data = response.data[0].attributes;

        if (!this.data) {
          this.error = 'No shipment found for the assigned driver.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error fetching shipment data.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleStartShipment(): void {
    console.log('Starting shipment update process...');
    if (!this.data) {
      this.error = 'No shipment selected';
      return;
    }

    this.isLoading = true;
    const driverId = this.userService.getDriverId();
    if (!driverId) {
      this.error = 'Driver ID not found';
      this.isLoading = false;
      return;
    }

    this.geolocationService.getCurrentLocation().subscribe({
      next: ({ lat, lon }) => {
        console.log('Location obtained:', { lat, lon });

        this.updateShipmentLocation(driverId, lat, lon);
      },
      error: (err) => {
        console.error('Error obtaining location:', err);
        this.error = 'Failed to get location.';
        this.isLoading = false;
      },
    });
  }

  private updateShipmentLocation(
    driverId: number,
    lat: number,
    lon: number
  ): void {
    this.apiService
      .updateShipmentStatus(driverId, 'in_transit', lat, lon)
      .subscribe({
        next: () => {
          this.success = 'Shipment is now in transit.';
          this.data.shipmentStatus = 'in_transit';
          this.loadAssignedShipment(driverId);
        },
        error: () => {
          this.error = 'Error updating shipment status.';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  handleCompleteShipment(): void {
    if (!this.data) {
      this.error = 'No shipment selected';
      return;
    }

    this.isLoading = true;
    const driverId = this.userService.getDriverId();
    if (!driverId) {
      this.error = 'Driver ID not found';
      this.isLoading = false;
      return;
    }

    this.apiService.updateShipmentStatus(driverId, 'completed').subscribe({
      next: () => {
        this.success = 'Shipment completed successfully.';
        this.data.shipmentStatus = 'completed';
        this.loadAssignedShipment(driverId);
      },
      error: () => {
        this.error = 'Error completing shipment.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-400';
      case 'in_transit':
        return 'bg-blue-400';
      case 'completed':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  }
}
