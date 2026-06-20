export interface ApiResponse<T> {
  status: 'Success' | 'Error';
  data?: T;
  message?: string;
  count?: number;
}
