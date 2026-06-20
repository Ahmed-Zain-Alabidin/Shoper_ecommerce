import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AddressCardComponent } from '../../shared/components/address-card/address-card.component';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Address } from '../../core/models/address.model';
import { API_ENDPOINTS } from '../../core/services/api.endpoints';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent, FooterComponent, AddressCardComponent],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);

  readonly addresses = signal<Address[]>([]);
  readonly selectedAddressId = signal<string | null>(null);
  readonly isLoadingAddresses = signal(true);
  readonly isPlacingOrder = signal(false);
  readonly isModalOpen = signal(false);
  readonly error = signal('');

  newAddress = { alias: '', street: '', city: '', postalCode: '', phone: '' };

  readonly subtotal = computed(() =>
    this.cartService.items().reduce((acc, item) => {
      const p = typeof item.product === 'object' ? item.product : { price: 0 };
      return acc + ((item.price ?? p.price ?? 0) * item.quantity);
    }, 0)
  );
  readonly shipping = computed(() => this.subtotal() > 100 ? 0 : 15);
  readonly total = computed(() => this.subtotal() + this.shipping());

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.cartService.items().length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.http.get<any>(API_ENDPOINTS.USER_ADDRESSES, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => {
        const addrs: Address[] = res.data || [];
        this.addresses.set(addrs);
        if (addrs.length > 0) this.selectedAddressId.set(addrs[0]._id);
        this.isLoadingAddresses.set(false);
      },
      error: () => this.isLoadingAddresses.set(false),
    });
  }

  addAddress(): void {
    this.http.post<any>(API_ENDPOINTS.USER_ADDRESSES, this.newAddress, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => {
        const addrs: Address[] = res.data || [];
        this.addresses.set(addrs);
        if (addrs.length > 0) this.selectedAddressId.set(addrs[addrs.length - 1]._id);
        this.isModalOpen.set(false);
        this.newAddress = { alias: '', street: '', city: '', postalCode: '', phone: '' };
        this.error.set('');
      },
      error: (err) => this.error.set(err.error?.message || 'Failed to add address'),
    });
  }

  placeOrder(): void {
    if (!this.selectedAddressId()) {
      this.error.set('Please select a shipping address before proceeding.');
      return;
    }
    this.isPlacingOrder.set(true);
    this.error.set('');

    this.http.post<any>(API_ENDPOINTS.ORDERS, {
      shippingAddress: this.selectedAddressId(),
    }, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/checkout/success']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to place order. Please try again.');
        this.isPlacingOrder.set(false);
      },
    });
  }

  getItemImage(item: any): string {
    const p = typeof item.product === 'object' ? item.product : {};
    return p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200';
  }

  getItemPrice(item: any): number {
    const p = typeof item.product === 'object' ? item.product : { price: 0 };
    return (item.price ?? p.price ?? 0) * item.quantity;
  }

  getProductName(item: any): string {
    const p = typeof item.product === 'object' ? item.product : null;
    return p?.name ?? 'Product';
  }
}
