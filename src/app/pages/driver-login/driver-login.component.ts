import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-driver-login',
  templateUrl: './driver-login.component.html',
  styleUrl: './driver-login.component.scss',
})
export class DriverLoginComponent {
  loginForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.error) {
          this.error = data.error.message;
          return;
        }
        this.authService.saveToken(data.jwt);
        localStorage.setItem('userData', JSON.stringify(data.user));
        this.router.navigate(['/driver/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Login failed. Please try again.';
        console.log(err);
      },
    });
  }
}
