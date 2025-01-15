const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller');
const { upload } = require('../middleware/upload');

router.post('/locations', storageController.createLocation);
router.get('/locations', storageController.getLocations);
router.get('/locations/:id', storageController.getLocationById);
router.put('/locations/:id', storageController.updateLocation);
router.delete('/locations/:id', storageController.deleteLocation);

router.post('/gold-storage', 
  upload.single('storageCertificate'),
  storageController.assignGoldToStorage
);
router.get('/gold-storage', storageController.getAllGoldStorage);
router.get('/gold-storage/:id', storageController.getGoldStorageById);
router.put('/gold-storage/:id', storageController.updateGoldStorage);

module.exports = router;