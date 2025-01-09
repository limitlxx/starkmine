const mongoose = require('mongoose');

const goldSchema = new mongoose.Schema({
  // Gold Bar Information
  weight: { type: Number, required: true },
  purity: { type: Number, required: true },
  serialNumber: { type: String, required: true, unique: true },
  
  // Documents
  assayReport: { type: String, required: true },
  certificateOfOrigin: { type: String, required: true },
  lastPurchaseInvoice: { type: String, required: true },
  billOfSale: { type: String, required: true },
  shippingDoc: { type: String, required: true },
  
  // Additional Information
  description: { type: String, required: true },
  title: { type: String, required: true },
  royaltyFee: { type: Number, required: true },
  presumedPrice: { type: Number, required: true },
  dealerWalletAddress: { type: String, required: true },
  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true },
  
  status: { type: String, enum: ['pending', 'approved', 'minted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gold', goldSchema);