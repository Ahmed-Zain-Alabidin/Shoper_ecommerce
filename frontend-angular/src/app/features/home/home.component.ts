import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    ProductCardComponent,
    CategoryCardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly isLoadingProducts = signal(true);
  readonly isLoadingCategories = signal(true);

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts(): void {
    this.productService.getProducts({ limit: 4, sort: 'newest' }).subscribe({
      next: (res) => {
        const valid = (res.data || []).filter(
          (p: Product) => p && p._id
        );
        this.products.set(valid);
        this.isLoadingProducts.set(false);
      },
      error: () => {
        this.isLoadingProducts.set(false);
      },
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        const valid = (res.data || [])
          .filter((c: Category) => c && c._id)
          .slice(0, 4);
        this.categories.set(valid);
        this.isLoadingCategories.set(false);
      },
      error: () => {
        this.isLoadingCategories.set(false);
      },
    });
  }
}
