// src/controllers/gold.controller.js
const Gold = require('../models/gold.model');
const Dealer = require('../models/dealer.model');
const { createAuditTrail } = require('../utils/audit');
const fs = require('fs').promises;
const mongoose = require('mongoose');

exports.createGold = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const files = req.files;
    const {
      weight,
      purity,
      serialNumber,
      description,
      title,
      royaltyFee,
      presumedPrice,
      dealerWalletAddress,
      dealerId
    } = req.body;

    // Validate dealer exists and is approved
    const dealer = await Dealer.findOne({ 
      _id: dealerId,
      status: 'approved'
    });

    if (!dealer) {
      throw new Error('Dealer not found or not approved');
    }

    const goldData = {
      weight: parseFloat(weight),
      purity: parseFloat(purity),
      serialNumber,
      description,
      title,
      royaltyFee: parseFloat(royaltyFee),
      presumedPrice: parseFloat(presumedPrice),
      dealerWalletAddress,
      dealerId,
      assayReport: files.assayReport[0].path,
      certificateOfOrigin: files.certificateOfOrigin[0].path,
      lastPurchaseInvoice: files.lastPurchaseInvoice[0].path,
      billOfSale: files.billOfSale[0].path,
      shippingDoc: files.shippingDoc[0].path
    };

    // Check for duplicate serial number
    const existingGold = await Gold.findOne({ serialNumber });
    if (existingGold) {
      throw new Error('Serial number already exists');
    }

    const gold = new Gold(goldData);
    await gold.save({ session });

    await createAuditTrail({
      entityType: 'gold',
      entityId: gold._id,
      action: 'create',
      changes: goldData,
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    }, session);

    await session.commitTransaction();
    res.status(201).json(gold);
  } catch (error) {
    await session.abortTransaction();
    
    // Cleanup uploaded files if transaction failed
    if (req.files) {
      Object.values(req.files).forEach(async (fileArray) => {
        await fs.unlink(fileArray[0].path).catch(console.error);
      });
    }
    
    res.status(400).json({ 
      error: error.message,
      details: error.stack
    });
  } finally {
    session.endSession();
  }
};

exports.getGold = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      dealerId,
      search,
      minWeight,
      maxWeight,
      minPurity,
      maxPurity,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (dealerId) query.dealerId = dealerId;
    if (minWeight || maxWeight) {
      query.weight = {};
      if (minWeight) query.weight.$gte = parseFloat(minWeight);
      if (maxWeight) query.weight.$lte = parseFloat(maxWeight);
    }
    if (minPurity || maxPurity) {
      query.purity = {};
      if (minPurity) query.purity.$gte = parseFloat(minPurity);
      if (maxPurity) query.purity.$lte = parseFloat(maxPurity);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const gold = await Gold.find(query)
      .populate('dealerId', 'legalName walletAddress')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Gold.countDocuments(query);

    res.json({
      gold,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalGold: total,
      resultsPerPage: limit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGoldById = async (req, res) => {
  try {
    const gold = await Gold.findById(req.params.id)
      .populate('dealerId', 'legalName walletAddress');

    if (!gold) {
      return res.status(404).json({ error: 'Gold not found' });
    }

    res.json(gold);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGold = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gold = await Gold.findById(req.params.id);
    if (!gold) {
      return res.status(404).json({ error: 'Gold not found' });
    }

    // Store old file paths for cleanup
    const oldFiles = {
      assayReport: gold.assayReport,
      certificateOfOrigin: gold.certificateOfOrigin,
      lastPurchaseInvoice: gold.lastPurchaseInvoice,
      billOfSale: gold.billOfSale,
      shippingDoc: gold.shippingDoc
    };

    const updates = { ...req.body };
    const files = req.files;

    // Handle file updates
    if (files) {
      for (const [fieldName, fileArray] of Object.entries(files)) {
        updates[fieldName] = fileArray[0].path;
      }
    }

    // Parse numeric values
    if (updates.weight) updates.weight = parseFloat(updates.weight);
    if (updates.purity) updates.purity = parseFloat(updates.purity);
    if (updates.royaltyFee) updates.royaltyFee = parseFloat(updates.royaltyFee);
    if (updates.presumedPrice) updates.presumedPrice = parseFloat(updates.presumedPrice);

    updates.updatedAt = new Date();

    const updatedGold = await Gold.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true, session }
    );

    await createAuditTrail({
      entityType: 'gold',
      entityId: gold._id,
      action: 'update',
      changes: updates,
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    }, session);

    await session.commitTransaction();

    // Clean up old files after successful update
    if (files) {
      for (const [fieldName, fileArray] of Object.entries(files)) {
        if (oldFiles[fieldName]) {
          await fs.unlink(oldFiles[fieldName]).catch(console.error);
        }
      }
    }

    res.json(updatedGold);
  } catch (error) {
    await session.abortTransaction();
    
    // Clean up new files if update failed
    if (req.files) {
      Object.values(req.files).forEach(async (fileArray) => {
        await fs.unlink(fileArray[0].path).catch(console.error);
      });
    }
    
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

exports.deleteGold = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gold = await Gold.findById(req.params.id);
    if (!gold) {
      return res.status(404).json({ error: 'Gold not found' });
    }

    // Store file paths for cleanup
    const files = [
      gold.assayReport,
      gold.certificateOfOrigin,
      gold.lastPurchaseInvoice,
      gold.billOfSale,
      gold.shippingDoc
    ];

    await gold.remove({ session });

    await createAuditTrail({
      entityType: 'gold',
      entityId: gold._id,
      action: 'delete',
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    }, session);

    await session.commitTransaction();

    // Clean up files after successful deletion
    for (const file of files) {
      if (file) {
        await fs.unlink(file).catch(console.error);
      }
    }

    res.json({ message: 'Gold deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

exports.updateGoldStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'approved', 'minted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      throw new Error('Invalid status value');
    }

    const gold = await Gold.findById(req.params.id);
    if (!gold) {
      return res.status(404).json({ error: 'Gold not found' });
    }

    gold.status = status;
    gold.updatedAt = new Date();
    await gold.save({ session });

    await createAuditTrail({
      entityType: 'gold',
      entityId: gold._id,
      action: 'statusUpdate',
      changes: { status },
      performedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    }, session);

    await session.commitTransaction();
    res.json(gold);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

exports.getGoldByDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { dealerId };
    if (status) query.status = status;

    const gold = await Gold.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Gold.countDocuments(query);

    res.json({
      gold,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalGold: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};