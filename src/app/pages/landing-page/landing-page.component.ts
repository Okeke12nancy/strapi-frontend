import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Search } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  trackForm: FormGroup;
  error: string = '';
  Search = Search;
  isLoading: boolean = false;

  private apiService = inject(ApiService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.trackForm = this.fb.group({
      orderId: ['', Validators.required],
    });
  }

  handleSubmit(): void {
    if (this.trackForm.invalid) {
      return;
    }

    const orderId = this.trackForm.value.orderId;
    this.isLoading = true;

    this.apiService.trackOrder(orderId).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.data.length === 0) {
          this.error = 'Order with ID ' + orderId + ' does not exist !';
          return;
        }
        this.router.navigate([`/track`], { queryParams: { orderId } });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = `Order with ID "${orderId}" was not found.`;
        console.error(err);
      },
    });
  }
}
