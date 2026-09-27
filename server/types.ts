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

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemRequest[];
  customerName?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed' | 'processing' | 'failed';
  createdAt: string;
  customerName: string;
}
