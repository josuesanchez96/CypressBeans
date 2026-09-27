import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingBag, Trash2, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (customerName: string) => void;
  isSubmitting: boolean;
  networkError: string | null;
  onRetry: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isSubmitting,
  networkError,
  onRetry,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal; // Can add tax if needed, total is real-time calculated

  const handleCheckoutClick = () => {
    setValidationError(null);

    // Validation rule: empty cart check
    if (cart.length === 0) {
      setValidationError('Tu carrito está vacío. Agrega al menos un café para realizar el pedido.');
      return;
    }

    // Validation rule: zero or negative quantities in cart items
    const invalidItem = cart.find(item => item.quantity <= 0);
    if (invalidItem) {
      setValidationError(`La cantidad de "${invalidItem.product.name}" debe ser mayor a 0.`);
      return;
    }

    onCheckout(customerName || 'Cliente Anónimo');
  };

  return (
    <aside className="cart-panel" data-cy="cart-panel">
      <div className="cart-header">
        <h2 className="cart-title">
          <ShoppingBag size={20} color="#f59e0b" />
          <span>Tu Pedido</span>
          {itemCount > 0 && <span className="badge-count" data-cy="cart-count">{itemCount}</span>}
        </h2>
        {cart.length > 0 && (
          <button
            className="btn-clear-cart"
            onClick={onClearCart}
            data-cy="clear-cart-btn"
          >
            Vaciar
          </button>
        )}
      </div>

      {networkError && (
        <div className="alert-banner error" data-cy="error-message">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div className="alert-content">
            <p><strong>Error al procesar:</strong> {networkError}</p>
            <button className="btn-retry" onClick={onRetry} data-cy="retry-btn">
              <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Reintentar
            </button>
          </div>
        </div>
      )}

      {validationError && (
        <div className="alert-banner error" data-cy="cart-validation-error">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div className="alert-content">
            <p>{validationError}</p>
          </div>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="cart-empty-state" data-cy="cart-empty">
          <div className="cart-empty-icon">☕</div>
          <p style={{ fontWeight: 600, color: '#f3f4f6' }}>El carrito está vacío</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Selecciona productos del menú para comenzar tu orden.</p>
        </div>
      ) : (
        <div className="cart-items-list" data-cy="cart-items-list">
          {cart.map(item => {
            const itemSubtotal = item.product.price * item.quantity;
            return (
              <div key={item.product.id} className="cart-item" data-cy="cart-item" data-product-id={item.product.id}>
                <div className="cart-item-info">
                  <div className="cart-item-name" data-cy="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-price">Q{item.product.price.toFixed(2)} c/u</div>
                </div>

                <div className="cart-item-controls">
                  <div className="qty-input-group" style={{ height: '1.8rem' }}>
                    <button
                      className="btn-qty"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      data-cy="cart-item-decrement"
                      style={{ width: '1.5rem', height: '1.8rem' }}
                    >
                      -
                    </button>
                    <span className="qty-number" style={{ width: '1.5rem', fontSize: '0.8rem' }} data-cy="cart-item-qty">
                      {item.quantity}
                    </span>
                    <button
                      className="btn-qty"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      data-cy="cart-item-increment"
                      style={{ width: '1.5rem', height: '1.8rem' }}
                    >
                      +
                    </button>
                  </div>

                  <span className="cart-item-subtotal" data-cy="cart-item-subtotal">
                    Q{itemSubtotal.toFixed(2)}
                  </span>

                  <button
                    className="btn-remove-item"
                    onClick={() => onRemoveItem(item.product.id)}
                    data-cy="remove-item-btn"
                    title="Eliminar producto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="cart-summary">
        <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Nombre del cliente (opcional):</label>
        <input
          type="text"
          className="customer-name-input"
          placeholder="Ej: Juan Pérez"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          data-cy="customer-name-input"
        />

        <div className="summary-row total-row">
          <span>Total:</span>
          <span className="total-amount" data-cy="cart-total">Q{total.toFixed(2)}</span>
        </div>

        <button
          className="btn-checkout"
          onClick={handleCheckoutClick}
          disabled={isSubmitting}
          data-cy="checkout-btn"
        >
          {isSubmitting ? (
            <span>Procesando...</span>
          ) : (
            <>
              <span>Confirmar Pedido</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
