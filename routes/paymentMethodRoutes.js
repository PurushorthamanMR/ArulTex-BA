const express = require('express');
const router = express.Router();
const paymentMethodService = require('../services/paymentMethodService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PaymentMethodController.save() invoked');
    const paymentMethodDto = await paymentMethodService.save(req.body);
    res.json(responseUtil.getServiceResponse(paymentMethodDto));
  } catch (error) {
    logger.error('Error saving payment method:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving payment method details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('PaymentMethodController.getAll() invoked');
    const paymentMethods = await paymentMethodService.getAll();
    res.json(responseUtil.getServiceResponse(paymentMethods));
  } catch (error) {
    logger.error('Error retrieving payment methods:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all payment method details', 500));
  }
});

module.exports = router;
