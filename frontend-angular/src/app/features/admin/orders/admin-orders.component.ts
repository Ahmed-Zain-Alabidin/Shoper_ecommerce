import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { API_ENDPOINTS, getOrderUrl } from '../../../core/services/api.endpoints';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

  readonly orders = signal<any[]>([]);
  readonly isLoading = signal(true);
  readonly updatingId = signal<string | null>(null);
  readonly toast = signal<string | null>(null);

  search = '';
  filterStatus = 'all';

  readonly statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  readonly filtered = computed(() => {
    return this.orders().filter(o => {
      const matchSearch = !this.search ||
        o._id?.toLowerCase().includes(this.search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(this.search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = this.filterStatus === 'all' || o.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  });

  readonly pendingCount = computed(() => this.orders().filter(o => o.status === 'pending').length);
  readonly deliveredCount = computed(() => this.orders().filter(o => o.status === 'delivered').length);

  ngOnInit(): void {
    this.http.get<any>(API_ENDPOINTS.ORDERS, { headers: this.authService.getAuthHeader() }).subscribe({
      next: (res) => { this.orders.set(res.data || []); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  updateStatus(orderId: string, newStatus: string): void {
    this.updatingId.set(orderId);
    this.http.put<any>(`${getOrderUrl(orderId)}/status`, { status: newStatus }, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: () => {
        this.orders.update(list => list.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        this.updatingId.set(null);
      },
      error: () => {
        this.showToast('Failed to update order status.');
        this.updatingId.set(null);
      },
    });
  }

  statusClass(s: string): string { return STATUS_COLORS[s] ?? 'bg-gray-100 text-gray-700'; }
  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  itemCount(order: any): number { return (order.cartItems || order.orderItems || []).length; }

  private showToast(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 3500);
  }
}
