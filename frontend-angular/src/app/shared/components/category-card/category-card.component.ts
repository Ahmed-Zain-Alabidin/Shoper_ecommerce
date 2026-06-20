import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { Category } from '../../../core/models/category.model';
import { getCategoryFallbackImage } from '../../utils/category-fallback.util';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink, LucideArrowRight],
  template: `
    <a
      [routerLink]="['/shop']"
      [queryParams]="{ category: category()._id }"
      class="group block relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5]"
    >
      <img
        [src]="imageUrl()"
        [alt]="category().name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500"></div>

      <div class="absolute inset-0 flex flex-col justify-end p-6">
        <h3 class="text-xl font-extrabold text-white tracking-tight leading-tight mb-3 drop-shadow-sm">
          {{ category().name }}
        </h3>

        <div class="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <span class="inline-flex items-center gap-2 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            Explore
            <svg lucideArrowRight class="w-3.5 h-3.5"></svg>
          </span>
        </div>
      </div>
    </a>
  `,
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();

  readonly imageUrl = computed(
    () => this.category().image || getCategoryFallbackImage(this.category().name)
  );
}
