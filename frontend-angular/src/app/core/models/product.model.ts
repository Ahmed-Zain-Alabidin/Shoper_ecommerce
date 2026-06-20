import { Category } from './category.model';

export interface ProductRatings {
  average?: number;
  count?: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency?: string;
  stock: number;
  images?: string[];
  category?: Category | string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  ratings?: ProductRatings;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormValue {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  currency: string;
  stock: string;
  category: string;
}
