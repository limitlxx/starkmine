const AuditTrail = require('../models/audit.model');

exports.getAuditTrail = async (req, res) => {
  try {
    const { page = 1, limit = 10, entityType, action, startDate, endDate } = req.query;
    
    const query = {};
    if (entityType) query.entityType = entityType;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const audits = await AuditTrail.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    const total = await AuditTrail.countDocuments(query);
    
    res.json({
      records: audits,
      totalRecords: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

// Add these new methods
exports.getEntityAuditTrail = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { 
      entityType,
      entityId
    };

    const audits = await AuditTrail.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AuditTrail.countDocuments(query);

    res.json({
      records: audits,
      totalRecords: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserAuditTrail = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query = { performedBy: userId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const audits = await AuditTrail.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AuditTrail.countDocuments(query);

    res.json({
      records: audits,
      totalRecords: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};