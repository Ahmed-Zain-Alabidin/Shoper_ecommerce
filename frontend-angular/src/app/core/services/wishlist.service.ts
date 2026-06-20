import { Injectable, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

const BASE_KEY = 'shoper-wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly authService = inject(AuthService);

  readonly items = signal<Product[]>([]);

  constructor() {
    this.loadItems();
  }

  private getStorageKey(): string {
    const userId = this.authService.user()?._id;
    return userId ? `${BASE_KEY}-${userId}` : `${BASE_KEY}-guest`;
  }

  private loadItems(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) {
        this.items.set([]);
        return;
      }
      const parsed = JSON.parse(raw);
      this.items.set(parsed?.state?.items ?? parsed?.items ?? []);
    } catch {
      this.items.set([]);
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify({ state: { items: this.items() }, version: 0 }),
    );
  }

  addToWishlist(product: Product): boolean {
    const exists = this.items().some((item) => item._id === product._id);
    if (!exists) {
      this.items.update((items) => [...items, product]);
      this.persist();
      return true;
    }
    return false;
  }

  removeFromWishlist(productId: string): void {
    this.items.update((items) =>
      items.filter((item) => item._id !== productId),
    );
    this.persist();
  }

  isInWishlist(productId: string): boolean {
    return this.items().some((item) => item._id === productId);
  }

  toggleWishlist(product: Product): boolean {
    if (this.isInWishlist(product._id)) {
      this.removeFromWishlist(product._id);
      return false;
    }
    this.addToWishlist(product);
    return true;
  }

  clearWishlist(): void {
    this.items.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.getStorageKey());
    }
  }

  getCount(): number {
    return this.items().length;
  }

  reloadForUser(): void {
    this.loadItems();
  }
}
