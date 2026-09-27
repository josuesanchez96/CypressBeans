import { Product, OrderResponse } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`Error al obtener los productos (${response.status})`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Fallo al cargar productos');
  }
  return result.data;
}

export async function createOrder(items: { productId: string; quantity: number }[], customerName?: string): Promise<OrderResponse> {
  let response: Response;
  try {
    response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, customerName }),
    });
  } catch (err: any) {
    throw new Error('Error de red o conexión rechazada por el servidor.');
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = result?.error || `Error del servidor (${response.status})`;
    throw new Error(errorMsg);
  }

  if (!result || !result.success) {
    throw new Error(result?.error || 'No se pudo confirmar el pedido.');
  }

  return result.data;
}
