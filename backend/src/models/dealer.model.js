const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  // Beneficial Owner Information
  legalName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  
  // Business Information
  governmentIssuedId: { type: String, required: true },
  proofOfAddress: { type: String, required: true },
  certificateOfIncorporation: { type: String, required: true },
  memorandumArticles: { type: String, required: true },
  tinNumber: { type: String, required: true },
  businessLicense: { type: String, required: true },
  
  // Additional Documents
  sourceOfFunds: { type: String, required: true },
  bankStatements: { type: String, required: true },
  proofOfGoldSource: { type: String, required: true },
  walletAddress: { type: String, required: true },
  
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dealer', dealerSchema);