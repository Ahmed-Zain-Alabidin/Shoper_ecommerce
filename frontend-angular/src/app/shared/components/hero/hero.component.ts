import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      class="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden bg-[#F9FCFF]"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 opacity-[0.02]"
          style="background-image: linear-gradient(rgba(21,93,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(21,93,252,0.3) 1px, transparent 1px); background-size: 50px 50px;"
        ></div>
      </div>

      <div class="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-full flex items-center">
          <div
            class="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <div
              class="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              <h1
                class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight"
              >
                Discover Your
                <span
                  class="block mt-1 sm:mt-2 bg-gradient-to-r from-[#155dfc] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent"
                >
                  Daily Essentials
                </span>
              </h1>

              <p
                class="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                From fashion to gaming, explore a curated collection designed
                for your lifestyle.
              </p>

              <div class="pt-2 sm:pt-4 flex justify-center lg:justify-start">
                <a
                  routerLink="/shop"
                  class="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#155dfc] to-[#8b5cf6] text-white text-sm sm:text-base lg:text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                >
                  Shop Now
                </a>
              </div>

              <div
                class="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm text-gray-700"
              >
                @for (badge of trustBadges; track badge) {
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-[#155dfc]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="font-semibold">{{ badge }}</span>
                  </div>
                }
              </div>
            </div>

            <div
              class="hidden lg:flex justify-center lg:justify-end items-center relative"
            >
              <div class="relative w-full max-w-lg xl:max-w-xl">
                <div
                  class="absolute inset-0 bg-gradient-to-br from-[#155dfc]/40 via-[#4a8cff]/30 to-[#155dfc]/40 blur-3xl rounded-full scale-90"
                ></div>
                <div class="relative z-10 animate-float">
                  <img
                    src="https://res.cloudinary.com/dw6ukveh4/image/upload/v1778367384/4095e006-f14e-477d-a092-90516087da7f_doiatx.png"
                    alt="Shoper Products"
                    class="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly trustBadges = ['Free Shipping', 'Secure Payment', 'Easy Returns'];
}
