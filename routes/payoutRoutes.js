const express = require('express');
const router = express.Router();
const payoutService = require('../services/payoutService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutController.gellAllPayout() invoked');
    const payouts = await payoutService.getAllPayout();
    res.json(responseUtil.getServiceResponse(payouts));
  } catch (error) {
    logger.error('Error retrieving payouts:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all payout details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const searchParams = {};

    const result = await payoutService.getAllPagePayout(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving payouts:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all payout details', 500));
  }
});

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutController.save() invoked');
    const payoutDto = await payoutService.save(req.body);
    res.json(responseUtil.getServiceResponse(payoutDto));
  } catch (error) {
    logger.error('Error saving payout:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving payout details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutController.updatePayout() invoked');
    const payoutDto = await payoutService.updatePayout(req.body);
    res.json(responseUtil.getServiceResponse(payoutDto));
  } catch (error) {
    logger.error('Error updating payout:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating payout details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutController.updateInvoiceStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const payoutDto = await payoutService.updatePayoutStatus(id, status);
    if (payoutDto) {
      res.json(responseUtil.getServiceResponse(payoutDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Payout not found', 404));
    }
  } catch (error) {
    logger.error('Error updating payout status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating payout status', 500));
  }
});

router.get('/getTotalPayout', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutController.getTotalPayout() invoked');
    const total = await payoutService.getTotalPayout();
    res.json(responseUtil.getServiceResponse(total));
  } catch (error) {
    logger.error('Error retrieving total payout:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving total payout', 500));
  }
});

module.exports = router;
