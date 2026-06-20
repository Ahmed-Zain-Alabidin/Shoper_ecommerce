import { Product } from './product.model';

export interface CartItem {
  product: Product | string;
  quantity: number;
  price?: number;
  currency?: string;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice?: number;
}
