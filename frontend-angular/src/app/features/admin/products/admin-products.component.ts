import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  readonly authService = inject(AuthService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(true);
  readonly deleteTarget = signal<Product | null>(null);
  readonly isDeleting = signal(false);
  readonly toast = signal<{ message: string; type: string } | null>(null);

  search = '';

  readonly filtered = computed(() =>
    this.products().filter(p => p.name?.toLowerCase().includes(this.search.toLowerCase()))
  );

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({ next: r => this.categories.set(r.data || []) });
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: r => { this.products.set(r.data || []); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  confirmDelete(): void {
    const t = this.deleteTarget();
    if (!t) return;
    this.isDeleting.set(true);
    this.productService.deleteProduct(t._id).subscribe({
      next: () => {
        this.products.update(ps => ps.filter(p => p._id !== t._id));
        this.showToast(`"${t.name}" deleted.`);
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

  getCategoryName(p: Product): string {
    const c = p.category;
    return typeof c === 'object' ? (c as Category).name : '';
  }

  stockClass(stock: number): string {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  private showToast(message: string, type = 'success'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}
