const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
  entityType: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  changes: { type: Object },
  performedBy: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditTrail', auditTrailSchema);