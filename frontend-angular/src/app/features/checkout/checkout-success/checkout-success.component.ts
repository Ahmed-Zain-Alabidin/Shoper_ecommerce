import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <app-navbar />
      <main class="flex-1 flex items-center justify-center px-4 py-20">
        <div class="text-center max-w-lg">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✅</div>
          <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h1>
          <p class="text-lg text-gray-600 mb-10">
            Thank you for your purchase! Your order has been placed and will be processed shortly.
            You'll receive a confirmation soon.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/profile/orders"
              class="px-8 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-md">
              Track My Order
            </a>
            <a routerLink="/shop"
              class="px-8 py-3.5 border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors">
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
      <app-footer />
    </div>
  `,
})
export class CheckoutSuccessComponent {}
