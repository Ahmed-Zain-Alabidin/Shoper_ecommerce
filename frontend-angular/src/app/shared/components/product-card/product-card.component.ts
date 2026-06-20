import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideEye, LucideHeart, LucideShoppingCart, LucideStar } from '@lucide/angular';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastComponent, ToastType } from '../toast/toast.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, LucideHeart, LucideShoppingCart, LucideEye, LucideStar, ToastComponent],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly showRemove = input(false);
  readonly remove = output<string>();

  readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly stars = [1, 2, 3, 4, 5];
  readonly toast = signal<{ message: string; type: ToastType } | null>(null);

  readonly imageUrl = computed(
    () =>
      this.product().images?.[0] ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
  );

  readonly categoryName = computed(() => {
    const category = this.product().category;
    return typeof category === 'object' ? category?.name || '' : '';
  });

  readonly rating = computed(() => this.product().ratingsAverage || 0);
  readonly reviewCount = computed(() => this.product().ratingsQuantity || 0);
  readonly outOfStock = computed(() => this.product().stock <= 0);
  readonly lowStock = computed(() => this.product().stock > 0 && this.product().stock <= 5);
  readonly currencySymbol = computed(() => (this.product().currency === 'USD' ? '$' : 'EGP '));
  readonly hasDiscount = computed(
    () => !!this.product().originalPrice && (this.product().originalPrice ?? 0) > this.product().price
  );
  readonly roundedRating = computed(() => Math.round(this.rating()));
  readonly isNew = computed(() => {
    const createdAt = this.product().createdAt;
    if (!createdAt) return false;
    return Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
  });
  readonly isWishlisted = computed(() => this.wishlistService.isInWishlist(this.product()._id));

  wishlistButtonClass(): string {
    const base =
      'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all duration-200';
    if (this.isWishlisted()) {
      return `${base} bg-white text-[#155dfc] scale-110 opacity-100`;
    }
    const visible = this.showRemove() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';
    return `${base} bg-white/70 text-gray-400 hover:text-[#155dfc] hover:scale-110 ${visible}`;
  }

  heartIconClass(): string {
    return this.isWishlisted() ? 'w-3.5 h-3.5 fill-[#155dfc]' : 'w-3.5 h-3.5';
  }

  async handleQuickAdd(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (this.outOfStock()) return;
    await this.cartService.addToCart(this.product(), 1);
    this.toast.set({ message: `"${this.product().name}" added to cart!`, type: 'success' });
  }

  handleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const added = this.wishlistService.toggleWishlist(this.product());
    if (added) {
      this.toast.set({ message: `"${this.product().name}" added to wishlist!`, type: 'success' });
    } else {
      this.toast.set({ message: `"${this.product().name}" removed from wishlist`, type: 'info' });
      if (this.showRemove()) {
        this.remove.emit(this.product()._id);
      }
    }
  }
}
