import { Routes } from '@angular/router';
import { authGuard, adminGuard, sellerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./features/support/support.component').then(
        (m) => m.SupportComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // Protected user routes
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'checkout/success',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout-success/checkout-success.component').then(
        (m) => m.CheckoutSuccessComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'profile/orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/orders/profile-orders.component').then(
        (m) => m.ProfileOrdersComponent
      ),
  },
  {
    path: 'profile/addresses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/addresses/profile-addresses.component').then(
        (m) => m.ProfileAddressesComponent
      ),
  },

  // Seller dashboard routes
  {
    path: 'dashboard',
    canActivate: [sellerGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'dashboard/products',
    canActivate: [sellerGuard],
    loadComponent: () =>
      import('./features/dashboard/products/dashboard-products.component').then(
        (m) => m.DashboardProductsComponent
      ),
  },
  {
    path: 'dashboard/products/add',
    canActivate: [sellerGuard],
    loadComponent: () =>
      import('./features/dashboard/products/add/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: 'dashboard/products/edit/:id',
    canActivate: [sellerGuard],
    loadComponent: () =>
      import('./features/dashboard/products/edit/edit-product.component').then(
        (m) => m.EditProductComponent
      ),
  },
  {
    path: 'dashboard/orders',
    canActivate: [sellerGuard],
    loadComponent: () =>
      import('./features/dashboard/orders/dashboard-orders.component').then(
        (m) => m.DashboardOrdersComponent
      ),
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/products/admin-products.component').then(
        (m) => m.AdminProductsComponent
      ),
  },
  {
    path: 'admin/orders',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/orders/admin-orders.component').then(
        (m) => m.AdminOrdersComponent
      ),
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/users/admin-users.component').then(
        (m) => m.AdminUsersComponent
      ),
  },
  {
    path: 'admin/categories',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/categories/admin-categories.component').then(
        (m) => m.AdminCategoriesComponent
      ),
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
