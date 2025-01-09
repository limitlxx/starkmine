const StorageLocation = require('../models/storage.model');
const GoldStorage = require('../models/goldStorage.model');
const { createAuditTrail } = require('../utils/audit');

exports.createLocation = async (req, res) => {
  try {
    const location = new StorageLocation(req.body);
    await location.save();
    
    await createAuditTrail({
      entityType: 'storage',
      entityId: location._id,
      action: 'create',
      performedBy: req.user.id
    });
    
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.assignGoldToStorage = async (req, res) => {
  try {
    const { goldId, storageLocationId, vaultNumber, insuranceDetails } = req.body;
    
    const storage = new GoldStorage({
      goldId,
      storageLocationId,
      vaultNumber,
      storageCertificate: req.file.path,
      insuranceDetails
    });
    
    await storage.save();
    
    // Update storage location occupancy
    const gold = await Gold.findById(goldId);
    await StorageLocation.findByIdAndUpdate(
      storageLocationId,
      { $inc: { currentOccupancy: gold.weight } }
    );
    
    await createAuditTrail({
      entityType: 'goldStorage',
      entityId: storage._id,
      action: 'create',
      performedBy: req.user.id
    });
    
    res.status(201).json(storage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};