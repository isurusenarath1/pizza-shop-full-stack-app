import mongoose from 'mongoose';

const PizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  ingredients: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
});

export default mongoose.model('Pizza', PizzaSchema); 