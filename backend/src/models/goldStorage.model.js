const mongoose = require('mongoose');

const goldStorageSchema = new mongoose.Schema({
  goldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gold', required: true },
  storageLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'StorageLocation', required: true },
  vaultNumber: { type: String, required: true },
  storageCertificate: { type: String, required: true },
  dateStored: { type: Date, default: Date.now },
  storageConditions: {
    temperature: Number,
    humidity: Number,
    lastChecked: Date
  },
  insuranceDetails: {
    policyNumber: String,
    provider: String,
    coverageAmount: Number,
    expiryDate: Date
  },
  status: { type: String, enum: ['stored', 'in-transit', 'removed'], default: 'stored' },
  lastAuditDate: { type: Date }
});

module.exports = mongoose.model('GoldStorage', goldStorageSchema);
