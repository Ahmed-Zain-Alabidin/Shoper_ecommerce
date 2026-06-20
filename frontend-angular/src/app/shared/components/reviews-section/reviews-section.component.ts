import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideLoader2, LucideMessageSquare, LucidePencil, LucideStar, LucideX } from '@lucide/angular';
import { firstValueFrom } from 'rxjs';
import { Review, ReviewStats } from '../../../core/models/review.model';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewCardComponent } from '../review-card/review-card.component';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [RouterLink, FormsModule, LucideStar, LucidePencil, LucideX, LucideLoader2, LucideMessageSquare, ReviewCardComponent],
  templateUrl: './reviews-section.component.html',
})
export class ReviewsSectionComponent implements OnInit {
  readonly productId = input.required<string>();
  readonly initialReviews = input<Review[]>([]);
  readonly reviewAdded = output<void>();

  readonly authService = inject(AuthService);
  private readonly reviewService = inject(ReviewService);

  readonly reviews = signal<Review[]>([]);
  readonly isModalOpen = signal(false);
  readonly rating = signal(0);
  readonly hoveredStar = signal(0);
  readonly comment = signal('');
  readonly isSubmitting = signal(false);
  readonly formError = signal('');

  readonly stars = [1, 2, 3, 4, 5];
  readonly ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  readonly stats = computed<ReviewStats>(() => {
    const list = this.reviews();
    const total = list.length;
    if (total === 0) return { average: 0, total: 0, breakdown: {} };

    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });
    return { average, total, breakdown };
  });

  readonly hasReviewed = computed(() => {
    const userId = this.authService.user()?._id;
    return this.reviews().some((r) => {
      const user = r.user;
      return (typeof user === 'object' ? user?._id : user) === userId;
    });
  });

  ngOnInit(): void {
    this.reviews.set(this.initialReviews());
  }

  activeStarValue(): number {
    return this.hoveredStar() || this.rating();
  }

  roundedAverage(): number {
    return Math.round(Number(this.stats().average));
  }

  breakdownPercent(star: number): number {
    const total = this.stats().total;
    const count = this.stats().breakdown[star] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  openModal(): void {
    this.formError.set('');
    this.rating.set(0);
    this.comment.set('');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  async submitReview(event: Event): Promise<void> {
    event.preventDefault();
    if (this.rating() === 0) {
      this.formError.set('Please select a star rating.');
      return;
    }
    if (!this.comment().trim()) {
      this.formError.set('Please write a comment.');
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');

    const user = this.authService.user();
    const optimistic: Review = {
      _id: `temp-${Date.now()}`,
      user: { _id: user!._id, name: user!.name, email: user!.email, role: user!.role },
      rating: this.rating(),
      comment: this.comment(),
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    this.reviews.update((prev) => [optimistic, ...prev]);
    this.isModalOpen.set(false);

    try {
      const res = await firstValueFrom(
        this.reviewService.submitReview(this.productId(), {
          product: this.productId(),
          rating: this.rating(),
          comment: this.comment(),
        })
      );
      this.reviews.update((prev) =>
        prev.map((r) => (r._id === optimistic._id ? (res.data as Review) : r))
      );
      this.rating.set(0);
      this.comment.set('');
      this.reviewAdded.emit();
    } catch (error: unknown) {
      this.reviews.update((prev) => prev.filter((r) => r._id !== optimistic._id));
      const err = error as { error?: { message?: string } };
      this.formError.set(err.error?.message || 'Failed to submit review. Please try again.');
      this.isModalOpen.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
