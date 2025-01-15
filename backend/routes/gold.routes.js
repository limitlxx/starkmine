const express = require('express');
const router = express.Router();
const goldController = require('../controllers/gold.controller');
const { upload } = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

const goldUploads = upload.fields([
  { name: 'assayReport', maxCount: 1 },
  { name: 'certificateOfOrigin', maxCount: 1 },
  { name: 'lastPurchaseInvoice', maxCount: 1 },
  { name: 'billOfSale', maxCount: 1 },
  { name: 'shippingDoc', maxCount: 1 }
]);

router.post('/', authenticate, goldUploads, goldController.createGold);
router.get('/', authenticate, goldController.getGold);
router.get('/:id', authenticate, goldController.getGoldById);
router.put('/:id', authenticate, goldUploads, goldController.updateGold);
router.delete('/:id', authenticate, goldController.deleteGold);
router.patch('/:id/status', authenticate, goldController.updateGoldStatus);
router.get('/dealer/:dealerId', authenticate, goldController.getGoldByDealer);

module.exports = router;