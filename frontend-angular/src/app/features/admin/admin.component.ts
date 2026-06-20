import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { API_ENDPOINTS } from '../../core/services/api.endpoints';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

  readonly isLoading = signal(true);
  readonly stats = signal({ revenue: 0, orders: 0, customers: 0, sellers: 0 });
  readonly recentOrders = signal<any[]>([]);

  readonly quickLinks = [
    { label: 'Manage Products', href: '/admin/products', icon: '📦', color: 'bg-blue-50 text-blue-600' },
    { label: 'Edit Categories', href: '/admin/categories', icon: '🏷️', color: 'bg-violet-50 text-violet-600' },
    { label: 'View Orders', href: '/admin/orders', icon: '🛍️', color: 'bg-amber-50 text-amber-600' },
    { label: 'Manage Users', href: '/admin/users', icon: '👥', color: 'bg-emerald-50 text-emerald-600' },
  ];

  ngOnInit(): void {
    const headers = this.authService.getAuthHeader();
    forkJoin({
      orders: this.http.get<any>(API_ENDPOINTS.ORDERS, { headers }),
      users: this.http.get<any>(API_ENDPOINTS.USERS, { headers }),
    }).subscribe({
      next: ({ orders, users }) => {
        const orderList = orders.data || [];
        const userList = users.data || [];
        this.stats.set({
          revenue: orderList.reduce((s: number, o: any) => s + (o.totalPrice || 0), 0),
          orders: orderList.length,
          customers: userList.filter((u: any) => u.role === 'customer').length,
          sellers: userList.filter((u: any) => u.role === 'seller').length,
        });
        this.recentOrders.set(orderList.slice(0, 6));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  statusClass(s: string): string { return STATUS_COLORS[s] ?? 'bg-gray-100 text-gray-700'; }
  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  formatRevenue(): string {
    return `$${this.stats().revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
