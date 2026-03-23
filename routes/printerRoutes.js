const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

router.post(
  '/print-zpl',
  authenticateToken,
  authorize('ADMIN', 'MANAGER', 'STAFF'),
  printerController.printZpl
);

router.post(
  '/print-epl',
  authenticateToken,
  authorize('ADMIN', 'MANAGER', 'STAFF'),
  printerController.printEpl
);

module.exports = router;
