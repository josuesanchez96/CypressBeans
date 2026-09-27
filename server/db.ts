import { Product, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-espresso',
    name: 'Espresso Doble Artesanal',
    category: 'coffee',
    description: 'Extracción precisa con notas a chocolate amargo y frutos secos.',
    price: 18.00,
    stock: 12,
    image: '☕',
    badge: 'Popular'
  },
  {
    id: 'prod-latte',
    name: 'Caramel Oat Latte',
    category: 'coffee',
    description: 'Espresso cremoso con leche de avena y sirope de caramelo orgánico.',
    price: 28.00,
    stock: 10,
    image: '🥛',
    badge: 'Recomendado'
  },
  {
    id: 'prod-coldbrew',
    name: 'Cold Brew Nitro 12h',
    category: 'cold_brew',
    description: 'Café macerado en frío durante 12 horas infused con nitrógeno suave.',
    price: 25.00,
    stock: 8,
    image: '🧊'
  },
  {
    id: 'prod-croissant',
    name: 'Croissant Mantequilla de Francia',
    category: 'pastry',
    description: 'Hojaldre crujiente horneado esta mañana con mantequilla de Bretaña.',
    price: 16.00,
    stock: 6,
    image: '🥐'
  },
  {
    id: 'prod-cheesecake',
    name: 'Cheesecake de Frutos Rojos',
    category: 'pastry',
    description: 'Pastel cremoso de queso artesano con mermelada casera de frambuesas.',
    price: 30.00,
    stock: 4,
    image: '🍰'
  },
  {
    id: 'prod-limited-muffin',
    name: 'Muffin de Arándanos (Última Unidad)',
    category: 'pastry',
    description: 'Esponjoso muffin relleno de arándanos silvestres frescos.',
    price: 18.00,
    stock: 1,
    image: '🧁',
    badge: 'Último en Stock'
  },
  {
    id: 'prod-cookie-soldout',
    name: 'Galleta Choco Chunk (Agotado)',
    category: 'pastry',
    description: 'Galleta artesanal con trozos gruesos de chocolate 70% cacao.',
    price: 14.00,
    stock: 0,
    image: '🍪',
    badge: 'Agotado'
  }
];

class Database {
  private products: Product[] = [];
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.reset();
  }

  public reset(): void {
    // Deep clone initial products
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.orders.clear();
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public createOrder(itemsReq: { productId: string; quantity: number }[], customerName: string = 'Cliente Cafetería'): Order {
    if (!itemsReq || itemsReq.length === 0) {
      throw new Error('El carrito no contiene productos.');
    }

    // Validate quantities and stock
    const orderItems = itemsReq.map(item => {
      if (item.quantity <= 0) {
        throw new Error(`Cantidad inválida (${item.quantity}) para el producto.`);
      }

      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
      }

      return {
        product,
        requestedQty: item.quantity
      };
    });

    // Deduct stock
    orderItems.forEach(({ product, requestedQty }) => {
      product.stock -= requestedQty;
    });

    // Calculate total & construct order
    let total = 0;
    const finalItems = orderItems.map(({ product, requestedQty }) => {
      const subtotal = Number((product.price * requestedQty).toFixed(2));
      total += subtotal;
      return {
        productId: product.id,
        name: product.name,
        quantity: requestedQty,
        unitPrice: product.price,
        subtotal
      };
    });

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder: Order = {
      id: orderId,
      items: finalItems,
      total: Number(total.toFixed(2)),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      customerName
    };

    this.orders.set(orderId, newOrder);
    return newOrder;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }
}

export const db = new Database();
