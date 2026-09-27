import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { Coffee, Search } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  isLoading: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, cart, onAddToCart, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todos los productos' },
    { id: 'coffee', label: 'Café Caliente ☕' },
    { id: 'cold_brew', label: 'Cold Brew & Izzi 🧊' },
    { id: 'pastry', label: 'Repostería 🥐' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantityForProduct = (productId: string): number => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="products-section">
      <div className="section-header">
        <h2 className="section-title">
          <Coffee size={24} color="#f59e0b" />
          <span>Menú de Especialidad</span>
        </h2>
      </div>

      <div className="category-tabs" data-cy="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            data-cy={`category-tab-${cat.id}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }} data-cy="products-loading">
          Cargando catálogo de café...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }} data-cy="no-products-found">
          No se encontraron productos disponibles.
        </div>
      ) : (
        <div className="products-grid" data-cy="products-list">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              cartQuantity={getCartQuantityForProduct(product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
