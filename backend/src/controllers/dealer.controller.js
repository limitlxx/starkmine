const Dealer = require('../models/dealer.model');
const { createAuditTrail } = require('../utils/audit');
const fs = require('fs').promises;

exports.createDealer = async (req, res) => {
  try {
    const files = req.files;
    const dealerData = {
      ...req.body,
      governmentIssuedId: files.governmentId[0].path,
      proofOfAddress: files.proofOfAddress[0].path,
      certificateOfIncorporation: files.certificateOfIncorporation[0].path,
      memorandumArticles: files.memorandumArticles[0].path,
      businessLicense: files.businessLicense[0].path,
      sourceOfFunds: files.sourceOfFunds[0].path,
      bankStatements: files.bankStatements[0].path,
      proofOfGoldSource: files.proofOfGoldSource[0].path
    };
    
    const dealer = new Dealer(dealerData);
    await dealer.save();
    
    await createAuditTrail({
      entityType: 'dealer',
      entityId: dealer._id,
      action: 'create',
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.status(201).json(dealer);
  } catch (error) {
    // Delete uploaded files if dealer creation fails
    if (req.files) {
      Object.values(req.files).forEach(async (fileArray) => {
        await fs.unlink(fileArray[0].path).catch(console.error);
      });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.getDealers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { legalName: { $regex: search, $options: 'i' } },
        { walletAddress: { $regex: search, $options: 'i' } }
      ];
    }
    
    const dealers = await Dealer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    const total = await Dealer.countDocuments(query);
    
    res.json({
      dealers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalDealers: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDealer = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    
    const updates = { ...req.body };
    const files = req.files;
    
    // Handle file updates
    if (files) {
      for (const [fieldName, fileArray] of Object.entries(files)) {
        // Delete old file
        if (dealer[fieldName]) {
          await fs.unlink(dealer[fieldName]).catch(console.error);
        }
        updates[fieldName] = fileArray[0].path;
      }
    }
    
    updates.updatedAt = new Date();
    
    const updatedDealer = await Dealer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    await createAuditTrail({
      entityType: 'dealer',
      entityId: dealer._id,
      action: 'update',
      changes: updates,
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json(updatedDealer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDealer = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    
    // Delete associated files
    const fileFields = [
      'governmentIssuedId',
      'proofOfAddress',
      'certificateOfIncorporation',
      'memorandumArticles',
      'businessLicense',
      'sourceOfFunds',
      'bankStatements',
      'proofOfGoldSource'
    ];
    
    for (const field of fileFields) {
      if (dealer[field]) {
        await fs.unlink(dealer[field]).catch(console.error);
      }
    }
    
    await dealer.remove();
    
    await createAuditTrail({
      entityType: 'dealer',
      entityId: dealer._id,
      action: 'delete',
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({ message: 'Dealer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDealerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const dealer = await Dealer.findById(req.params.id);
    
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    
    dealer.status = status;
    dealer.updatedAt = new Date();
    await dealer.save();
    
    await createAuditTrail({
      entityType: 'dealer',
      entityId: dealer._id,
      action: 'statusUpdate',
      changes: { status },
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json(dealer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};