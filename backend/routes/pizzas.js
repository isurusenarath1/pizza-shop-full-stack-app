import express from 'express';
import Pizza from '../models/Pizza.js';

const router = express.Router();

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single pizza by ID
router.get('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ error: 'Pizza not found' });
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new pizza
router.post('/', async (req, res) => {
  try {
    const pizza = new Pizza(req.body);
    await pizza.save();
    res.status(201).json(pizza);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a pizza
router.put('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ error: 'Pizza not found' });
    res.json(pizza);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a pizza
router.delete('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ error: 'Pizza not found' });
    res.json({ message: 'Pizza deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 