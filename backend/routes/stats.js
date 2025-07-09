import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Pizza from '../models/Pizza.js';

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const [orders, users, pizzas] = await Promise.all([
      Order.find(),
      User.find(),
      Pizza.find(),
    ]);
    const today = new Date();
    today.setHours(0,0,0,0);
    const ordersToday = orders.filter(o => new Date(o.createdAt) >= today).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeCustomers = users.filter(u => u.status === 'active').length;
    const pizzaTypes = pizzas.length;
    // Recent orders (last 5)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(o => ({
        id: o._id,
        customer: o.customerName,
        items: o.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
        total: `$${o.total.toFixed(2)}`,
        status: o.status,
        time: o.createdAt,
      }));
    // Popular pizzas (top 5 by order count)
    const pizzaCount = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        pizzaCount[i.name] = (pizzaCount[i.name] || 0) + i.quantity;
      });
    });
    const popularPizzas = Object.entries(pizzaCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, orders]) => ({ name, orders }));
    res.json({
      totalRevenue,
      ordersToday,
      activeCustomers,
      pizzaTypes,
      recentOrders,
      popularPizzas,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 