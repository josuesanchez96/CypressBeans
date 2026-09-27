import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, cartQuantity }) => {
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [qtyError, setQtyError] = useState<string | null>(null);

  const availableStock = product.stock - cartQuantity;
  const isSoldOut = product.stock <= 0 || availableStock <= 0;

  const handleDecrement = () => {
    setQtyError(null);
    if (selectedQty > 1) {
      setSelectedQty(prev => prev - 1);
    }
  };

  const handleIncrement = () => {
    setQtyError(null);
    if (selectedQty < availableStock) {
      setSelectedQty(prev => prev + 1);
    } else {
      setQtyError(`Stock máximo disponible alcanzado (${availableStock})`);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQtyError(null);
    if (isNaN(val)) {
      setSelectedQty(0);
      setQtyError('Introduce un número válido.');
    } else if (val < 1) {
      setSelectedQty(val);
      setQtyError('La cantidad debe ser al menos 1.');
    } else if (val > availableStock) {
      setSelectedQty(val);
      setQtyError(`Solo quedan ${availableStock} unidades en stock.`);
    } else {
      setSelectedQty(val);
    }
  };

  const handleAdd = () => {
    if (selectedQty <= 0) {
      setQtyError('La cantidad no puede ser 0 o negativa.');
      return;
    }
    if (selectedQty > availableStock) {
      setQtyError(`Supera el stock disponible (${availableStock}).`);
      return;
    }
    setQtyError(null);
    onAddToCart(product, selectedQty);
    setSelectedQty(1);
  };

  let stockClass = 'in-stock';
  let stockText = `${availableStock} disp.`;
  if (isSoldOut) {
    stockClass = 'sold-out';
    stockText = 'Agotado';
  } else if (availableStock <= 3) {
    stockClass = 'low-stock';
    stockText = `¡Solo ${availableStock}!`;
  }

  return (
    <div
      className={`product-card ${isSoldOut ? 'out-of-stock' : ''}`}
      data-cy="product-card"
      data-product-id={product.id}
    >
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <div className="product-icon">{product.image}</div>
      <h3 className="product-title" data-cy="product-title">{product.name}</h3>
      <p className="product-desc">{product.description}</p>

      <div className="product-meta">
        <span className="product-price" data-cy="product-price">Q{product.price.toFixed(2)}</span>
        <span className={`stock-indicator ${stockClass}`} data-cy="stock-badge">
          {stockText}
        </span>
      </div>

      {qtyError && (
        <div className="alert-banner error" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', marginBottom: '0.5rem' }} data-cy="validation-error">
          <AlertCircle size={14} />
          <span>{qtyError}</span>
        </div>
      )}

      <div className="card-actions">
        <div className="qty-input-group">
          <button
            className="btn-qty"
            onClick={handleDecrement}
            disabled={isSoldOut || selectedQty <= 1}
            data-cy="quantity-decrement"
            aria-label="Disminuir cantidad"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            className="qty-number"
            value={selectedQty}
            onChange={handleQuantityChange}
            disabled={isSoldOut}
            min={1}
            max={availableStock}
            data-cy="quantity-input"
          />
          <button
            className="btn-qty"
            onClick={handleIncrement}
            disabled={isSoldOut || selectedQty >= availableStock}
            data-cy="quantity-increment"
            aria-label="Aumentar cantidad"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          className="btn-add-cart"
          onClick={handleAdd}
          disabled={isSoldOut || selectedQty <= 0 || selectedQty > availableStock}
          data-cy="add-to-cart-btn"
        >
          <ShoppingBag size={16} />
          <span>{isSoldOut ? 'Agotado' : 'Agregar'}</span>
        </button>
      </div>
    </div>
  );
};
