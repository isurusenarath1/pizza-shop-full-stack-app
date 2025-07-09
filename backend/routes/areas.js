import express from 'express';
import Area from '../models/Area.js';

const router = express.Router();

// Get all areas
router.get('/', async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new area
router.post('/', async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.status(201).json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an area
router.put('/:id', async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!area) return res.status(404).json({ error: 'Area not found' });
    res.json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an area
router.delete('/:id', async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ error: 'Area not found' });
    res.json({ message: 'Area deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 