import mongoose from 'mongoose';

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deliveryFee: { type: Number, required: true },
  deliveryTime: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  postalCodes: { type: [String], default: [] },
  orderCount: { type: Number, default: 0 },
});

export default mongoose.model('Area', AreaSchema); 