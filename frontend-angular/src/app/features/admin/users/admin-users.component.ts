import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { API_ENDPOINTS } from '../../../core/services/api.endpoints';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-700',
  seller: 'bg-blue-100 text-blue-700',
  customer: 'bg-gray-100 text-gray-600',
};

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

  readonly users = signal<any[]>([]);
  readonly isLoading = signal(true);
  readonly actionId = signal<string | null>(null);
  readonly toast = signal<{ message: string; type: string } | null>(null);

  search = '';
  roleFilter = 'all';

  readonly filtered = computed(() => {
    return this.users().filter(u => {
      const matchSearch = !this.search ||
        u.name?.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.search.toLowerCase());
      const matchRole = this.roleFilter === 'all' || u.role === this.roleFilter;
      return matchSearch && matchRole;
    });
  });

  readonly counts = computed(() => ({
    all: this.users().length,
    admin: this.users().filter(u => u.role === 'admin').length,
    seller: this.users().filter(u => u.role === 'seller').length,
    customer: this.users().filter(u => u.role === 'customer').length,
  }));

  readonly suspendedCount = computed(() => this.users().filter(u => u.isSuspended).length);

  getCountForRole(role: string): number {
    const c = this.counts();
    return (c as Record<string, number>)[role] ?? 0;
  }

  ngOnInit(): void {
    this.http.get<any>(API_ENDPOINTS.USERS, { headers: this.authService.getAuthHeader() }).subscribe({
      next: (res) => { this.users.set(res.data || []); this.isLoading.set(false); },
      error: () => { this.showToast('Failed to load users.', 'error'); this.isLoading.set(false); },
    });
  }

  updateStatus(userId: string, updates: object, successMsg: string): void {
    this.actionId.set(userId);
    this.http.put<any>(`${API_ENDPOINTS.USERS}/${userId}/status`, updates, {
      headers: this.authService.getAuthHeader(),
    }).subscribe({
      next: (res) => {
        this.users.update(list => list.map(u => u._id === userId ? res.data.data : u));
        this.showToast(successMsg);
        this.actionId.set(null);
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Action failed.', 'error');
        this.actionId.set(null);
      },
    });
  }

  roleClass(role: string): string { return ROLE_COLORS[role] ?? 'bg-gray-100 text-gray-600'; }

  avatarColor(name: string): string {
    const colors = ['bg-violet-100 text-violet-700', 'bg-blue-100 text-blue-700',
      'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'];
    const ch = (name?.charAt(0).toUpperCase() || 'A').charCodeAt(0);
    return colors[ch % colors.length];
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private showToast(message: string, type = 'success'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}
