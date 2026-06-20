import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ReviewsSectionComponent } from '../../shared/components/reviews-section/reviews-section.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ReviewService } from '../../core/services/review.service';
import { Product } from '../../core/models/product.model';
import { Review } from '../../core/models/review.model';
import { Category } from '../../core/models/category.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, ReviewsSectionComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly reviewService = inject(ReviewService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  // Use null instead of undefined so non-null assertion works cleanly
  readonly product = signal<Product | null>(null);
  readonly reviews = signal<Review[]>([]);
  readonly isLoading = signal(true);
  readonly selectedImage = signal(0);
  readonly quantity = signal(1);
  readonly toast = signal<string | null>(null);
  readonly productId = signal('');

  readonly images = computed(() => {
    const imgs = this.product()?.images;
    return imgs && imgs.length > 0
      ? imgs
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'];
  });

  readonly currencySymbol = computed(() =>
    this.product()?.currency === 'EGP' ? 'EGP ' : '$'
  );

  readonly categoryName = computed(() => {
    const cat = this.product()?.category;
    return typeof cat === 'object' ? (cat as Category).name : '';
  });

  readonly inWishlist = computed(() => {
    const p = this.product();
    return p ? this.wishlistService.isInWishlist(p._id) : false;
  });

  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productId.set(id);

    forkJoin({
      product: this.productService.getProductById(id),
      reviews: this.reviewService.getProductReviews(id).pipe(
        catchError(() => of({ data: [] as Review[] }))
      ),
    }).subscribe({
      next: ({ product, reviews }) => {
        // ApiResponse.data may be undefined when product not found
        this.product.set(product.data ?? null);
        this.reviews.set((reviews as any).data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  refreshProduct(): void {
    this.productService.getProductById(this.productId()).subscribe({
      next: (res) => this.product.set(res.data ?? null),
    });
  }

  async addToCart(): Promise<void> {
    const p = this.product();
    if (!p) return;
    await this.cartService.addToCart(p, this.quantity());
    this.showToast(`"${p.name}" added to cart!`);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (!p) return;
    const added = this.wishlistService.toggleWishlist(p);
    this.showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
  }

  decQty(): void { this.quantity.update(q => Math.max(1, q - 1)); }
  incQty(): void { this.quantity.update(q => Math.min(this.product()?.stock ?? 99, q + 1)); }

  isStar(star: number): boolean {
    return star <= Math.round(this.product()?.ratingsAverage ?? 0);
  }

  private showToast(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 3500);
  }
}
