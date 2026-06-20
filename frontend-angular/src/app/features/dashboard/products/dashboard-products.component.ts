import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-dashboard-products',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-products.component.html',
})
export class DashboardProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  readonly authService = inject(AuthService);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly deleteTarget = signal<Product | null>(null);
  readonly isDeleting = signal(false);
  readonly toast = signal<{ message: string; type: string } | null>(null);

  search = '';

  readonly filtered = computed(() =>
    this.products().filter(p => p.name?.toLowerCase().includes(this.search.toLowerCase()))
  );

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading.set(true);
    this.productService.getProducts({ limit: 200 }).subscribe({
      next: (res) => {
        let data = res.data || [];
        const user = this.authService.user();
        if (user?.role === 'seller') {
          data = data.filter((p: any) => p.seller?._id === user._id || p.seller === user._id);
        }
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => { this.showToast('Failed to load products.', 'error'); this.isLoading.set(false); },
    });
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.isDeleting.set(true);
    this.productService.deleteProduct(target._id).subscribe({
      next: () => {
        this.products.update(ps => ps.filter(p => p._id !== target._id));
        this.showToast(`"${target.name}" deleted successfully.`);
        this.deleteTarget.set(null);
        this.isDeleting.set(false);
      },
      error: (err: any) => {
        this.showToast(err.error?.message || 'Failed to delete.', 'error');
        this.deleteTarget.set(null);
        this.isDeleting.set(false);
      },
    });
  }

  stockClass(stock: number): string {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getCategoryName(p: Product): string {
    const c = p.category;
    return typeof c === 'object' ? c.name : '';
  }

  private showToast(message: string, type = 'success'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}
