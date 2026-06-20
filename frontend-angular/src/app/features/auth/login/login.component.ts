import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../core/services/api.endpoints';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.http.post<any>(API_ENDPOINTS.LOGIN, { email, password }).subscribe({
      next: (data) => {
        this.authService.login(data.data, data.data.token);
        const role = data.data?.role;
        if (role === 'admin') this.router.navigate(['/admin']);
        else if (role === 'seller') this.router.navigate(['/dashboard']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid credentials');
        this.isLoading.set(false);
      },
    });
  }
}
