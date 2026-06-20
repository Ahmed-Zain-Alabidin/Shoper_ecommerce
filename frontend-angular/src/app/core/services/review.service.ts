import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getProductReviewsUrl } from './api.endpoints';
import { ApiResponse } from '../models/api-response.model';
import { Review } from '../models/review.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getProductReviews(productId: string): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(getProductReviewsUrl(productId));
  }

  submitReview(
    productId: string,
    payload: { product: string; rating: number; comment: string }
  ): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(getProductReviewsUrl(productId), payload, {
      headers: this.authService.getAuthHeader(),
    });
  }
}
