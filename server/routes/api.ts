import { Router, Request, Response } from 'express';
import { db } from '../db';
import { CreateOrderPayload } from '../types';

const router = Router();

// GET /api/products - Get all coffee shop products
router.get('/products', (_req: Request, res: Response) => {
  const products = db.getProducts();
  res.json({ success: true, data: products });
});

// POST /api/orders - Create a new order
router.post('/orders', (req: Request, res: Response) => {
  try {
    const { items, customerName } = req.body as CreateOrderPayload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El pedido debe contener al menos un producto.'
      });
    }

    const order = db.createOrder(items, customerName);
    return res.status(201).json({
      success: true,
      message: '¡Pedido confirmado con éxito!',
      data: order
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Error al procesar el pedido.'
    });
  }
});

// GET /api/orders/:id - Get order details
router.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Pedido no encontrado.' });
  }
  return res.json({ success: true, data: order });
});

// POST /api/reset or /api/seed - Cypress seed/reset endpoint
const handleReset = (_req: Request, res: Response) => {
  db.reset();
  return res.json({
    success: true,
    message: 'Base de datos reiniciada al estado de prueba inicial.',
    timestamp: new Date().toISOString()
  });
};

router.post('/reset', handleReset);
router.post('/seed', handleReset);

export default router;
