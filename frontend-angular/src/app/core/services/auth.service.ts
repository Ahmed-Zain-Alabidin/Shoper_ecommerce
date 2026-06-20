import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { AuthState, User } from '../models/user.model';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';

const STORAGE_KEY = 'auth-storage';

interface PersistedAuth {
  state: AuthState;
  version?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly injector = inject(Injector);

  private readonly userSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly hydratedSignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly hasHydrated = this.hydratedSignal.asReadonly();

  constructor() {
    this.hydrateFromStorage();
  }

  login(userData: User, token: string): void {
    this.userSignal.set(userData);
    this.tokenSignal.set(token);
    this.persist();
    this.injector.get(CartService).fetchCart();
    this.injector.get(WishlistService).reloadForUser();
  }

  logout(): void {
    this.injector.get(CartService).clearLocalCart();
    this.injector.get(WishlistService).clearWishlist();
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.persist();
  }

  getAuthHeader(): Record<string, string> {
    const token = this.tokenSignal();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private hydrateFromStorage(): void {
    if (typeof window === 'undefined') {
      this.hydratedSignal.set(true);
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedAuth;
        const state = parsed.state;
        if (state?.token) {
          this.userSignal.set(state.user);
          this.tokenSignal.set(state.token);
          this.injector.get(CartService).fetchCart();
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      this.hydratedSignal.set(true);
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') return;

    const payload: PersistedAuth = {
      state: {
        user: this.userSignal(),
        token: this.tokenSignal(),
        isAuthenticated: !!this.tokenSignal(),
      },
      version: 0,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}
