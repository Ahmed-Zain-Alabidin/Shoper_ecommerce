import { Product } from './product.model';

export interface OrderItem {
  product: Product | string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: Record<string, unknown>;
  paymentMethod?: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}
