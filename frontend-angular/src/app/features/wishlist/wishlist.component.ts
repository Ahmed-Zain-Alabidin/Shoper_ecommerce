import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, ProductCardComponent],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent {
  readonly wishlistService = inject(WishlistService);
  readonly cartService = inject(CartService);

  readonly showClearModal = signal(false);
  readonly toastMessage = signal<string | null>(null);

  get items(): Product[] {
    return this.wishlistService.items();
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }

  handleRemove(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
    this.showToast('Item removed from wishlist');
  }

  async handleAddAllToCart(): Promise<void> {
    let count = 0;
    for (const item of this.items) {
      if (item.stock > 0) {
        await this.cartService.addToCart(item, 1);
        count++;
      }
    }
    this.showToast(`${count} item${count !== 1 ? 's' : ''} added to cart!`);
  }

  confirmClear(): void {
    this.wishlistService.clearWishlist();
    this.showClearModal.set(false);
    this.showToast('Wishlist cleared');
  }
}
