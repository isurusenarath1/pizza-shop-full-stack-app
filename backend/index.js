import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import pizzaRoutes from './routes/pizzas.js';
import orderRoutes from './routes/orders.js';
import areaRoutes from './routes/areas.js';
import userRoutes from './routes/users.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Pizza Shop API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 