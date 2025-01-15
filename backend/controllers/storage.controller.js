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
 

// Add these new methods
exports.getLocations = async (req, res) => {
  try {
    const locations = await StorageLocation.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await StorageLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await StorageLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    await createAuditTrail({
      entityType: 'storage',
      entityId: location._id,
      action: 'update',
      performedBy: req.user.id
    });
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await StorageLocation.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    await createAuditTrail({
      entityType: 'storage',
      entityId: req.params.id,
      action: 'delete',
      performedBy: req.user.id
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllGoldStorage = async (req, res) => {
  try {
    const goldStorage = await GoldStorage.find();
    res.json(goldStorage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGoldStorageById = async (req, res) => {
  try {
    const storage = await GoldStorage.findById(req.params.id);
    if (!storage) {
      return res.status(404).json({ error: 'Gold storage not found' });
    }
    res.json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGoldStorage = async (req, res) => {
  try {
    const storage = await GoldStorage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!storage) {
      return res.status(404).json({ error: 'Gold storage not found' });
    }
    
    await createAuditTrail({
      entityType: 'goldStorage',
      entityId: storage._id,
      action: 'update',
      performedBy: req.user.id
    });
    
    res.json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};