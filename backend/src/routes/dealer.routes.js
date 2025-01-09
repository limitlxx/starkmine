const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealer.controller');
const { upload } = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

const dealerUploads = upload.fields([
  { name: 'governmentId', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 },
  { name: 'certificateOfIncorporation', maxCount: 1 },
  { name: 'memorandumArticles', maxCount: 1 },
  { name: 'businessLicense', maxCount: 1 },
  { name: 'sourceOfFunds', maxCount: 1 },
  { name: 'bankStatements', maxCount: 1 },
  { name: 'proofOfGoldSource', maxCount: 1 }
]);

router.post('/', authenticate, dealerUploads, dealerController.createDealer);
router.get('/', authenticate, dealerController.getDealers);
router.get('/:id', authenticate, dealerController.getDealerById);
router.put('/:id', authenticate, dealerUploads, dealerController.updateDealer);
router.delete('/:id', authenticate, dealerController.deleteDealer);
router.patch('/:id/status', authenticate, dealerController.updateDealerStatus);

module.exports = router;