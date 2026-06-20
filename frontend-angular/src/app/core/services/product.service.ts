import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, getProductUrl } from './api.endpoints';
import { ApiResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getProducts(params?: Record<string, string | number>): Observable<ApiResponse<Product[]>> {
    const query = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.http.get<ApiResponse<Product[]>>(`${API_ENDPOINTS.PRODUCTS}${query}`);
  }

  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(getProductUrl(id));
  }

  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS, formData, {
      headers: this.authService.getAuthHeader(),
    });
  }

  updateProduct(id: string, formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(getProductUrl(id), formData, {
      headers: this.authService.getAuthHeader(),
    });
  }

  deleteProduct(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(getProductUrl(id), {
      headers: this.authService.getAuthHeader(),
    });
  }
}
