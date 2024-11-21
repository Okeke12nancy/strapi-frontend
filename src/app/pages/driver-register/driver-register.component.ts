import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-driver-register',
  templateUrl: './driver-register.component.html',
  styleUrl: './driver-register.component.scss',
})
export class DriverRegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  handleSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password } = this.registerForm.value;
    this.isLoading = true;

    this.authService.register(name, email, password).subscribe({
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
        this.error = 'Registration failed. Please try again.';
        console.error(err);
      },
    });
  }
}
