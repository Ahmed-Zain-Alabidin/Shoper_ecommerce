import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from './api.endpoints';
import { AuthService } from './auth.service';
import { Cart, CartItem } from '../models/cart.model';
import { ApiResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';
import { SKIP_AUTH_REDIRECT } from '../interceptors/skip-auth-redirect.token';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly items = signal<CartItem[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    if (!this.authService.token()) {
      this.initGuestCart();
    }
  }

  private getStorageKey(): string {
    const userId = this.authService.user()?._id;
    return userId ? `shoper-cart-${userId}` : 'shoper-cart-guest';
  }

  private loadLocalItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed?.state?.items ?? parsed?.items ?? [];
    } catch {
      return [];
    }
  }

  private persistLocalItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify({ state: { items }, version: 0 }),
    );
  }

  initGuestCart(): void {
    if (!this.authService.token()) {
      this.items.set(this.loadLocalItems());
    }
  }

  async fetchCart(): Promise<void> {
    const token = this.authService.token();
    if (!token) return;

    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Cart>>(API_ENDPOINTS.CART, {
          headers: this.authService.getAuthHeader(),
          context: new HttpContext().set(SKIP_AUTH_REDIRECT, true),
        }),
      );
      this.items.set(res.data?.items ?? []);
      this.persistLocalItems(res.data?.items ?? []);
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;
      if (status === 401) {
        this.authService.logout();
        return;
      }
      console.error('Failed to fetch cart', error);
    }
  }

  clearLocalCart(): void {
    this.items.set([]);
    this.error.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.getStorageKey());
    }
  }

  async addToCart(product: Product | string, quantity: number): Promise<void> {
    const token = this.authService.token();

    if (!token) {
      this.items.update((state) => {
        const productId = typeof product === 'object' ? product._id : product;
        const productObj = typeof product === 'object' ? product : product;
        const existing = state.find(
          (i) =>
            (typeof i.product === 'object' ? i.product._id : i.product) ===
            productId,
        );
        if (existing) {
          return state.map((i) =>
            (typeof i.product === 'object' ? i.product._id : i.product) ===
            productId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...state, { product: productObj as Product, quantity }];
      });
      this.persistLocalItems(this.items());
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const productId = typeof product === 'object' ? product._id : product;
      const res = await firstValueFrom(
        this.http.post<ApiResponse<Cart>>(
          API_ENDPOINTS.CART,
          { productId, quantity },
          { headers: this.authService.getAuthHeader() },
        ),
      );
      this.items.set(res.data?.items ?? []);
      this.persistLocalItems(res.data?.items ?? []);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      console.error('Add to cart error:', error);
      this.error.set(err.error?.message ?? 'Failed to add to cart');
    } finally {
      this.isLoading.set(false);
    }
  }

  async removeFromCart(productId: string): Promise<void> {
    const token = this.authService.token();

    if (!token) {
      this.items.update((state) =>
        state.filter(
          (i) =>
            (typeof i.product === 'object' ? i.product._id : i.product) !==
            productId,
        ),
      );
      this.persistLocalItems(this.items());
      return;
    }

    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.delete<ApiResponse<Cart>>(
          `${API_ENDPOINTS.CART}/${productId}`,
          {
            headers: this.authService.getAuthHeader(),
          },
        ),
      );
      this.items.set(res.data?.items ?? []);
    } catch (error) {
      console.error('Remove from cart error:', error);
      this.error.set('Failed to remove item');
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity < 1) return;
    const token = this.authService.token();

    if (!token) {
      this.items.update((state) =>
        state.map((i) =>
          (typeof i.product === 'object' ? i.product._id : i.product) ===
          productId
            ? { ...i, quantity }
            : i,
        ),
      );
      this.persistLocalItems(this.items());
      return;
    }

    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.put<ApiResponse<Cart>>(
          `${API_ENDPOINTS.CART}/${productId}`,
          { quantity },
          { headers: this.authService.getAuthHeader() },
        ),
      );
      this.items.set(res.data?.items ?? []);
    } catch (error) {
      console.error('Update quantity error:', error);
      this.error.set('Failed to update quantity');
    } finally {
      this.isLoading.set(false);
    }
  }

  async clearCart(): Promise<void> {
    const token = this.authService.token();

    if (!token) {
      this.clearLocalCart();
      return;
    }

    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.delete(API_ENDPOINTS.CART, {
          headers: this.authService.getAuthHeader(),
        }),
      );
      this.items.set([]);
      this.error.set(null);
    } catch {
      this.error.set('Failed to clear cart');
    } finally {
      this.isLoading.set(false);
    }
  }

  getCartCount(): number {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  }
}
