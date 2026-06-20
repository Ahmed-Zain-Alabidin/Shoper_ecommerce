import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasHydrated()) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasHydrated() || !authService.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  if (authService.user()?.role === 'admin') {
    return true;
  }

  return router.createUrlTree(['/']);
};

export const sellerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasHydrated() || !authService.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  const role = authService.user()?.role;
  if (role === 'admin') {
    return router.createUrlTree(['/admin']);
  }

  if (role === 'seller') {
    return true;
  }

  return router.createUrlTree(['/']);
};
