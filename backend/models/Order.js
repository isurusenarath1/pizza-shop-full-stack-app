import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  address: { type: String, required: true },
  area: { type: String },
  items: [
    {
      name: String,
      size: String,
      extras: [String],
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  paymentMethod: { type: String, default: 'cash' },
  orderTime: { type: String },
  estimatedDelivery: { type: String },
  specialInstructions: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema); 