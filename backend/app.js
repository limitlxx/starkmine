const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const dealerRoutes = require('./routes/dealer.routes');
const goldRoutes = require('./routes/gold.routes');
const storageRoutes = require('./routes/storage.routes');
const auditRoutes = require('./routes/audit.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dealers', dealerRoutes);
app.use('/api/gold', goldRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});