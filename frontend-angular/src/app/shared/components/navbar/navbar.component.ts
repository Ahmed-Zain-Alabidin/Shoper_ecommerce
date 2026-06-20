import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideHeart,
  LucideLogOut,
  LucideMenu,
  LucideSearch,
  LucideShoppingBag,
  LucideUser,
  LucideX,
} from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    LucideSearch,
    LucideHeart,
    LucideShoppingBag,
    LucideUser,
    LucideLogOut,
    LucideMenu,
    LucideX,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  readonly isMobileMenuOpen = signal(false);

  cartCount(): number {
    return this.cartService.getCartCount();
  }

  wishlistCount(): number {
    return this.wishlistService.getCount();
  }

  dashboardLink(): string {
    return this.authService.user()?.role === 'admin' ? '/admin' : '/dashboard';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  userFirstName(): string {
    return this.authService.user()?.name?.split(' ')[0] ?? 'Profile';
  }

  logout(): void {
    this.authService.logout();
    this.isMobileMenuOpen.set(false);
  }
}
