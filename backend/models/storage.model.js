const mongoose = require('mongoose');

const storageLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  securityLevel: { type: String, enum: ['high', 'medium', 'low'], required: true },
  storageCapacity: { type: Number, required: true }, // in kg
  currentOccupancy: { type: Number, default: 0 },
  vaultDetails: {
    vaultNumber: { type: String, required: true },
    securityFeatures: [String],
  },
  contactPerson: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StorageLocation', storageLocationSchema);
