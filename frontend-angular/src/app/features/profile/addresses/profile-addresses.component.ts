import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AddressCardComponent } from '../../../shared/components/address-card/address-card.component';
import { AuthService } from '../../../core/services/auth.service';
import { Address } from '../../../core/models/address.model';
import { API_ENDPOINTS } from '../../../core/services/api.endpoints';

@Component({
  selector: 'app-profile-addresses',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent, AddressCardComponent],
  templateUrl: './profile-addresses.component.html',
})
export class ProfileAddressesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

  readonly addresses = signal<Address[]>([]);
  readonly isLoading = signal(true);
  readonly isModalOpen = signal(false);
  readonly deletingId = signal<string | null>(null);
  error = '';

  newAddress = { alias: '', street: '', city: '', postalCode: '', phone: '' };

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.http.get<any>(API_ENDPOINTS.USER_ADDRESSES, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => { this.addresses.set(res.data || []); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  addAddress(): void {
    this.http.post<any>(API_ENDPOINTS.USER_ADDRESSES, this.newAddress, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => {
        this.addresses.set(res.data || []);
        this.isModalOpen.set(false);
        this.newAddress = { alias: '', street: '', city: '', postalCode: '', phone: '' };
        this.error = '';
      },
      error: (err) => this.error = err.error?.message || 'Failed to add address',
    });
  }

  deleteAddress(id: string): void {
    this.deletingId.set(id);
    this.http.delete<any>(`${API_ENDPOINTS.USER_ADDRESSES}/${id}`, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => { this.addresses.set(res.data || []); this.deletingId.set(null); },
      error: () => this.deletingId.set(null),
    });
  }
}
