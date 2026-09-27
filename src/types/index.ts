export interface Product {
  id: string;
  name: string;
  category: 'coffee' | 'pastry' | 'cold_brew';
  description: string;
  price: number;
  stock: number;
  image: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed' | 'processing' | 'failed';
  createdAt: string;
  customerName: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
