import {
  Component, OnInit, OnDestroy, inject, signal, computed
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

interface Pagination { total: number; page: number; pages: number; }

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, FormsModule, NgTemplateOutlet, NavbarComponent, FooterComponent, ProductCardComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly pagination = signal<Pagination>({ total: 0, page: 1, pages: 1 });
  readonly isLoading = signal(true);
  readonly isMobileFilterOpen = signal(false);

  search = '';
  selectedCategories: string[] = [];
  priceMin = 0;
  priceMax = 1000;
  inStockOnly = false;
  sort = 'newest';
  page = 1;

  readonly sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price', label: 'Price: Low → High' },
    { value: '-price', label: 'Price: High → Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  readonly pricePresets = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50-$200', min: 50, max: 200 },
    { label: '$200+', min: 200, max: 1000 },
  ];

  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.search) count++;
    count += this.selectedCategories.length;
    if (this.priceMin > 0 || this.priceMax < 1000) count++;
    if (this.inStockOnly) count++;
    if (this.sort !== 'newest') count++;
    return count;
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.pagination().pages }, (_, i) => i + 1)
  );

  ngOnInit(): void {
    // Read category query param
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const cat = params.get('category');
      if (cat) this.selectedCategories = [cat];
      this.fetchProducts();
    });

    // Load categories
    this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => this.categories.set(res.data || []),
    });

    // Debounce search
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.fetchProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.search);
  }

  fetchProducts(): void {
    this.isLoading.set(true);
    const params: Record<string, string | number> = {
      sort: this.sort,
      page: this.page,
      limit: 8,
    };
    if (this.search) params['name'] = this.search;
    if (this.priceMin > 0) params['minPrice'] = this.priceMin;
    if (this.priceMax < 1000) params['maxPrice'] = this.priceMax;
    if (this.selectedCategories.length === 1) params['category'] = this.selectedCategories[0];

    this.productService.getProducts(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        let data: Product[] = res.data || [];
        if (this.inStockOnly) data = data.filter(p => p.stock > 0);
        // Handle multiple categories client-side
        if (this.selectedCategories.length > 1) {
          data = data.filter(p => {
            const catId = typeof p.category === 'object' ? (p.category as Category)._id : p.category;
            return this.selectedCategories.includes(catId ?? '');
          });
        }
        this.products.set(data);
        if ((res as any).pagination) this.pagination.set((res as any).pagination);
        else this.pagination.set({ total: data.length, page: this.page, pages: 1 });
        this.isLoading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.isLoading.set(false);
      },
    });
  }

  toggleCategory(catId: string): void {
    if (this.selectedCategories.includes(catId)) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== catId);
    } else {
      this.selectedCategories = [...this.selectedCategories, catId];
    }
    this.page = 1;
    this.fetchProducts();
  }

  isCategorySelected(catId: string): boolean {
    return this.selectedCategories.includes(catId);
  }

  setSort(value: string): void {
    this.sort = value;
    this.page = 1;
    this.fetchProducts();
  }

  setPricePreset(min: number, max: number): void {
    this.priceMin = min;
    this.priceMax = max;
    this.page = 1;
    this.fetchProducts();
  }

  isPricePreset(min: number, max: number): boolean {
    return this.priceMin === min && this.priceMax === max;
  }

  onPriceChange(): void {
    this.page = 1;
    this.fetchProducts();
  }

  resetFilters(): void {
    this.search = '';
    this.selectedCategories = [];
    this.priceMin = 0;
    this.priceMax = 1000;
    this.inStockOnly = false;
    this.sort = 'newest';
    this.page = 1;
    this.fetchProducts();
  }

  setPage(p: number): void {
    this.page = p;
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  readonly skeletons = [1, 2, 3, 4, 5, 6];
}
