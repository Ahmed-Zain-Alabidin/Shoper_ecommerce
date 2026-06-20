import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { API_ENDPOINTS } from '../../core/services/api.endpoints';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  isEditing = false;
  form = { name: '', phone: '' };
  isLoading = false;
  error = '';
  success = '';

  constructor() {
    effect(() => {
      const u = this.authService.user();
      if (u) this.form = { name: u.name || '', phone: (u as any).phone || '' };
    });
  }

  startEdit(): void { this.isEditing = true; this.success = ''; this.error = ''; }
  cancelEdit(): void { this.isEditing = false; }

  save(): void {
    this.isLoading = true; this.error = ''; this.success = '';
    this.http.put<any>(API_ENDPOINTS.USER_UPDATE, this.form, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => {
        this.authService.login(res.data, this.authService.token()!);
        this.success = 'Profile updated successfully!';
        this.isEditing = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile.';
        this.isLoading = false;
      },
    });
  }

  readonly navLinks = [
    { label: 'Profile', route: '/profile', end: true },
    { label: 'My Orders', route: '/profile/orders' },
    { label: 'Addresses', route: '/profile/addresses' },
  ];
}
