import { Component, input, computed } from '@angular/core';
import { LucideStar, LucideBadgeCheck } from '@lucide/angular';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [LucideStar, LucideBadgeCheck],
  template: `
    <div class="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            [class]="colorClass()"
          >
            {{ initial() }}
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900 leading-tight">{{ name() }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formattedDate() }}</p>
          </div>
        </div>

        <span class="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
          <svg lucideBadgeCheck class="w-3 h-3"></svg>
          Verified
        </span>
      </div>

      <div class="flex items-center gap-0.5">
        @for (star of stars; track star) {
          <svg
            lucideStar
            class="w-4 h-4"
            [class.text-amber-400]="star <= review().rating"
            [class.fill-amber-400]="star <= review().rating"
            [class.text-gray-200]="star > review().rating"
            [class.fill-gray-200]="star > review().rating"
          ></svg>
        }
        <span class="ml-2 text-xs font-semibold text-gray-500">{{ review().rating }}.0</span>
      </div>

      <p class="text-sm text-gray-600 leading-relaxed">{{ review().comment }}</p>
    </div>
  `,
})
export class ReviewCardComponent {
  readonly review = input.required<Review>();
  readonly stars = [1, 2, 3, 4, 5];

  readonly name = computed(() => {
    const user = this.review().user;
    if (typeof user === 'object' && user?.name) return user.name;
    return 'Anonymous';
  });

  readonly initial = computed(() => this.name().charAt(0).toUpperCase());

  readonly formattedDate = computed(() => {
    const date = this.review().createdAt;
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  readonly colorClass = computed(() => {
    const colors = [
      'bg-violet-100 text-violet-700',
      'bg-blue-100 text-blue-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-cyan-100 text-cyan-700',
    ];
    return colors[this.initial().charCodeAt(0) % colors.length];
  });
}
