import React from 'react';
import { OrderResponse } from '../types';
import { CheckCircle2, Coffee, Sparkles } from 'lucide-react';

interface OrderConfirmationProps {
  order: OrderResponse;
  onClose: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onClose }) => {
  return (
    <div className="modal-overlay" data-cy="order-confirmation-modal">
      <div className="modal-card">
        <div className="success-badge-icon">
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
          ¡Pedido Confirmado!
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Tu café se está preparando artesanalmente.
        </p>

        <div className="order-id-chip" data-cy="order-id">
          {order.id}
        </div>

        <div className="order-summary-box">
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Resumen de la Orden ({order.customerName})
          </p>
          {order.items.map((item, idx) => (
            <div key={idx} className="order-summary-item" data-cy="confirmed-order-item">
              <span>{item.quantity}x {item.name}</span>
              <span>Q{item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="order-summary-total">
            <span>Total Pagado:</span>
            <span style={{ color: '#f59e0b' }} data-cy="order-confirmed-total">
              Q{order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          className="btn-close-modal"
          onClick={onClose}
          data-cy="close-modal-btn"
        >
          Aceptar y Crear Nuevo Pedido
        </button>
      </div>
    </div>
  );
};
