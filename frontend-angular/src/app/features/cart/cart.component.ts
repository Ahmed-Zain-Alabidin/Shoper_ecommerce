import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  readonly cartService = inject(CartService);

  readonly validItems = computed(() =>
    this.cartService.items().filter((item) => item && item.product)
  );

  readonly subtotal = computed(() =>
    this.validItems().reduce((acc, item) => {
      const product = typeof item.product === 'object' ? item.product : ({} as Product);
      const price = item.price ?? product.price ?? 0;
      return acc + price * item.quantity;
    }, 0)
  );

  readonly shipping = computed(() => (this.subtotal() > 100 ? 0 : 15));
  readonly total = computed(() => this.subtotal() + this.shipping());

  readonly displayCurrency = computed(() => {
    const first = this.validItems()[0];
    const product = first && typeof first.product === 'object' ? first.product : ({} as Product);
    return first?.currency ?? product.currency ?? 'USD';
  });

  readonly currencySymbol = computed(() =>
    this.displayCurrency() === 'EGP' ? 'EGP' : '$'
  );

  getProduct(item: CartItem): Product {
    return typeof item.product === 'object' ? item.product : ({} as Product);
  }

  getProductId(item: CartItem): string {
    return typeof item.product === 'object' ? item.product._id : (item.product as string);
  }

  getImage(item: CartItem): string {
    const p = this.getProduct(item);
    if (p.images?.length) return p.images[0];
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop';
  }

  getPrice(item: CartItem): number {
    return item.price ?? this.getProduct(item).price ?? 0;
  }

  getItemCurrencySymbol(item: CartItem): string {
    const c = item.currency ?? this.getProduct(item).currency ?? 'USD';
    return c === 'EGP' ? 'EGP' : '$';
  }

  formatPrice(symbol: string, amount: number): string {
    return symbol === 'EGP' ? `EGP ${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
  }

  updateQuantity(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
