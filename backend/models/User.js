import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  role: { type: String, enum: ['customer', 'staff', 'manager', 'super_admin'], default: 'customer' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  permissions: { type: [String], default: [] },
  joinDate: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrder: { type: Date },
});

export default mongoose.model('User', UserSchema); 