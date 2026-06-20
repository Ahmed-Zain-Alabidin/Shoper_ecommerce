import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);

  readonly productCount = signal(0);
  readonly isLoading = signal(true);

  readonly cards = [
    { label: 'My Products', value: () => this.isLoading() ? '—' : String(this.productCount()), href: '/dashboard/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Add Product', value: () => 'New', href: '/dashboard/products/add', color: 'bg-green-50 text-green-600' },
    { label: 'Orders', value: () => 'View All', href: '/dashboard/orders', color: 'bg-purple-50 text-purple-600' },
  ];

  ngOnInit(): void {
    this.productService.getProducts({ limit: 200 }).subscribe({
      next: (res) => {
        const user = this.authService.user();
        const all = res.data || [];
        const count = user?.role === 'seller'
          ? all.filter((p: any) => p.seller?._id === user._id || p.seller === user._id).length
          : all.length;
        this.productCount.set(count);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  firstName(): string {
    return this.authService.user()?.name?.split(' ')[0] ?? 'there';
  }
}
