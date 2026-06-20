import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { API_ENDPOINTS } from '../../../core/services/api.endpoints';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    role: ['customer'],
  });

  get passwordMismatch(): boolean {
    const { password, confirmPassword } = this.form.getRawValue();
    return confirmPassword.length > 0 && password !== confirmPassword;
  }

  submit(): void {
    if (this.form.invalid || this.passwordMismatch) {
      if (this.passwordMismatch) this.error.set('Passwords do not match.');
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);

    const { name, email, phone, password, role } = this.form.getRawValue();

    this.http.post<any>(API_ENDPOINTS.SIGNUP, { name, email, phone, password, role }).subscribe({
      next: (data) => {
        // Fetch full profile to get all user fields
        this.http.get<any>(API_ENDPOINTS.USER_ME, {
          headers: { Authorization: `Bearer ${data.data.token}` },
        }).subscribe({
          next: (profileData) => {
            const fullUser = profileData.data || data.data;
            this.authService.login(fullUser, data.data.token);
            const r = fullUser.role;
            if (r === 'admin') this.router.navigate(['/admin']);
            else if (r === 'seller') this.router.navigate(['/dashboard']);
            else this.router.navigate(['/']);
          },
          error: () => {
            this.authService.login(data.data, data.data.token);
            this.router.navigate(['/']);
          },
        });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed');
        this.isLoading.set(false);
      },
    });
  }
}
