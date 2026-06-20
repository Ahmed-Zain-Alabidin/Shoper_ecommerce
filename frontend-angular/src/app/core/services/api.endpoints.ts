import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  SIGNUP: `${API_URL}/api/auth/signup`,
  USERS: `${API_URL}/api/users`,
  USER_ME: `${API_URL}/api/users/me`,
  USER_UPDATE: `${API_URL}/api/users/updateMe`,
  USER_ADDRESSES: `${API_URL}/api/users/addresses`,
  PRODUCTS: `${API_URL}/api/products`,
  CATEGORIES: `${API_URL}/api/categories`,
  CART: `${API_URL}/api/cart`,
  ORDERS: `${API_URL}/api/orders`,
  MY_ORDERS: `${API_URL}/api/orders/myorders`,
  WISHLIST: `${API_URL}/api/wishlist`,
} as const;

export const getProductUrl = (id: string): string => `${API_URL}/api/products/${id}`;
export const getCategoryUrl = (id: string): string => `${API_URL}/api/categories/${id}`;
export const getOrderUrl = (id: string): string => `${API_URL}/api/orders/${id}`;
export const getProductReviewsUrl = (productId: string): string =>
  `${API_URL}/api/products/${productId}/reviews`;
