import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { API_ENDPOINTS } from '../../../core/services/api.endpoints';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

@Component({
  selector: 'app-profile-orders',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './profile-orders.component.html',
})
export class ProfileOrdersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

  readonly orders = signal<any[]>([]);
  readonly isLoading = signal(true);
  readonly expandedOrder = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<any>(API_ENDPOINTS.MY_ORDERS, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => { this.orders.set(res.data || []); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  toggleExpand(id: string): void {
    this.expandedOrder.update(v => v === id ? null : id);
  }

  statusClass(status: string): string {
    return STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  getItems(order: any): any[] {
    return order.cartItems || order.orderItems || [];
  }

  itemPrice(item: any): number {
    const p = item.product || item;
    return (item.price || p.price || 0) * item.quantity;
  }

  itemImage(item: any): string {
    const p = item.product || item;
    return p.images?.[0] || '';
  }

  itemName(item: any): string {
    return (item.product || item).name || 'Product';
  }
}
