import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCreditCard } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideCreditCard],
  template: `
    <footer
      class="bg-gray-50 pt-12 md:pt-16 pb-6 md:pb-8 border-t border-gray-100"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16"
        >
          <div class="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col">
            <a
              routerLink="/"
              class="text-xl md:text-2xl font-extrabold tracking-tighter text-gray-900 mb-3 md:mb-4 inline-block"
            >
              Shoper<span class="text-blue-600">.</span>
            </a>
            <p class="text-gray-600 text-sm leading-relaxed mb-4 md:mb-6">
              Curating premium, high-quality essentials designed to elevate your
              modern lifestyle.
            </p>
            <div class="flex items-center space-x-3 md:space-x-4">
              <a
                href="#"
                class="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                  ></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <div class="col-span-1">
            <h3
              class="text-xs md:text-sm font-bold tracking-wider text-gray-900 uppercase mb-3 md:mb-4"
            >
              Shop
            </h3>
            <ul class="space-y-2 md:space-y-3">
              <li>
                <a
                  routerLink="/shop"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >All Products</a
                >
              </li>
              <li>
                <a
                  routerLink="/categories"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Categories</a
                >
              </li>
              <li>
                <a
                  routerLink="/shop"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >New Arrivals</a
                >
              </li>
              <li>
                <a
                  routerLink="/shop"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Discounts</a
                >
              </li>
            </ul>
          </div>

          <div class="col-span-1">
            <h3
              class="text-xs md:text-sm font-bold tracking-wider text-gray-900 uppercase mb-3 md:mb-4"
            >
              Support
            </h3>
            <ul class="space-y-2 md:space-y-3">
              <li>
                <a
                  routerLink="/support"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Help Center</a
                >
              </li>
              <li>
                <a
                  routerLink="/profile/orders"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Order Tracking</a
                >
              </li>
              <li>
                <a
                  routerLink="/support"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Shipping &amp; Returns</a
                >
              </li>
              <li>
                <a
                  routerLink="/support"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >FAQs</a
                >
              </li>
            </ul>
          </div>

          <div class="col-span-1">
            <h3
              class="text-xs md:text-sm font-bold tracking-wider text-gray-900 uppercase mb-3 md:mb-4"
            >
              Company
            </h3>
            <ul class="space-y-2 md:space-y-3">
              <li>
                <a
                  routerLink="/about"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >About Us</a
                >
              </li>
              <li>
                <a
                  routerLink="/support"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Contact Us</a
                >
              </li>
              <li>
                <a
                  routerLink="/"
                  class="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >Privacy Policy</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div
          class="pt-6 md:pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p
            class="text-xs md:text-sm font-medium text-gray-500 text-center md:text-left"
          >
            &copy; {{ currentYear }} Shoper. All rights reserved.
          </p>
          <div
            class="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-gray-400"
          >
            <span
              class="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase"
              >Secure Checkout</span
            >
            <svg lucideCreditCard class="w-4 h-4 md:w-5 md:h-5"></svg>
            <div
              class="px-1.5 md:px-2 py-0.5 md:py-1 bg-white border border-gray-200 rounded text-[9px] md:text-[10px] font-extrabold text-gray-600 tracking-wider"
            >
              VISA
            </div>
            <div
              class="px-1.5 md:px-2 py-0.5 md:py-1 bg-white border border-gray-200 rounded text-[9px] md:text-[10px] font-extrabold text-gray-600 tracking-wider"
            >
              MC
            </div>
            <div
              class="px-1.5 md:px-2 py-0.5 md:py-1 bg-white border border-gray-200 rounded text-[9px] md:text-[10px] font-extrabold text-gray-600 tracking-wider"
            >
              PAYPAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
