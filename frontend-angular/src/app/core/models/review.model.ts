import { User } from './user.model';

export interface Review {
  _id: string;
  user?: User | string;
  product?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  _optimistic?: boolean;
}

export interface ReviewStats {
  average: string | number;
  total: number;
  breakdown: Record<number, number>;
}
