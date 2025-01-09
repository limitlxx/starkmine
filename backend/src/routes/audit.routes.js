const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, auditController.getAuditTrail);
router.get('/entity/:entityType/:entityId', authenticate, auditController.getEntityAuditTrail);
router.get('/user/:userId', authenticate, auditController.getUserAuditTrail);

module.exports = router;