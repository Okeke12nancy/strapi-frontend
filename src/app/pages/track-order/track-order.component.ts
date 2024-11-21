import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  orderId: string | null = null;
  orderData = null;
  error: string = '';
  isLoading: boolean = false;
  private subscription: Subscription | null = null;
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }
    this.startPolling();
  }

  startPolling(): void {
    this.isLoading = true;
    this.subscription = this.apiService.trackOrder(+this.orderId).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.error) {
          this.error = data.error.message;
          return;
        }
        this.orderData = data.data[0].attributes;
        if (this.orderData.shipment) {
          const { latitude, longitude } =
            this.orderData.shipment.data.attributes;
          this.initializeMap(latitude, longitude);
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Tracking failed. Please try again.';
      },
    });
  }

  initializeMap(lat: number, lng: number): void {
    if (this.map) {
      this.map.setView([lat, lng], 18);
      this.marker?.setLatLng([lat, lng]);
      this.marker.setPopupContent('Shipment Location');
      return;
    }

    setTimeout(() => {
      this.map = L.map('map', {
        center: [lat, lng],
        zoom: 18,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('Shipment Location')
        .openPopup();

      L.control.scale().addTo(this.map);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.map?.remove();
  }
}
