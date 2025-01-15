const AuditTrail = require('../models/audit.model');

exports.createAuditTrail = async ({ entityType, entityId, action, changes, performedBy }) => {
  const audit = new AuditTrail({
    entityType,
    entityId,
    action,
    changes,
    performedBy
  });
  return audit.save();
};