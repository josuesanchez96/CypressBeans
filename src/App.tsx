import React, { useEffect, useState } from 'react';
import { Product, CartItem, OrderResponse } from './types';
import { fetchProducts, createOrder } from './api/client';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { OrderConfirmation } from './components/OrderConfirmation';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [isResettingDb, setIsResettingDb] = useState<boolean>(false);
  
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponse | null>(null);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    setNetworkError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setNetworkError(err.message || 'Fallo al cargar el catálogo de productos.');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product: Product, quantity: number) => {
    setNetworkError(null);
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingIdx].quantity + quantity;
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: Math.min(newQty, product.stock),
        };
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    setNetworkError(null);
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(newQty, item.product.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckout = async (customerName: string) => {
    if (cart.length === 0) return;

    setIsSubmittingOrder(true);
    setNetworkError(null);

    const payloadItems = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    try {
      const order = await createOrder(payloadItems, customerName);
      setConfirmedOrder(order);
      setCart([]);
      // Reload products to reflect updated stock in UI
      await loadProducts();
    } catch (err: any) {
      setNetworkError(err.message || 'Ha ocurrido un error al procesar el pedido.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleResetDb = async () => {
    setIsResettingDb(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      setCart([]);
      setConfirmedOrder(null);
      setNetworkError(null);
      await loadProducts();
    } catch (err: any) {
      console.error('Error al reiniciar DB:', err);
    } finally {
      setIsResettingDb(false);
    }
  };

  return (
    <div className="app-container" data-cy="app-container">
      <Header onResetDb={handleResetDb} isResetting={isResettingDb} />

      <main className="main-layout">
        <ProductList
          products={products}
          cart={cart}
          onAddToCart={handleAddToCart}
          isLoading={isLoadingProducts}
        />

        <Cart
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          isSubmitting={isSubmittingOrder}
          networkError={networkError}
          onRetry={() => {
            if (cart.length > 0) {
              handleCheckout('Cliente');
            } else {
              loadProducts();
            }
          }}
        />
      </main>

      {confirmedOrder && (
        <OrderConfirmation
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
};

export default App;
