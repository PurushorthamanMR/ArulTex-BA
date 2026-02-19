const express = require('express');
const router = express.Router();
const payoutCategoryService = require('../services/payoutCategoryService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutCategoryController.save() invoked');
    const payoutCategoryDto = await payoutCategoryService.save(req.body);
    res.json(responseUtil.getServiceResponse(payoutCategoryDto));
  } catch (error) {
    logger.error('Error saving payout category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving payout category details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutCategoryController.update() invoked');
    const payoutCategoryDto = await payoutCategoryService.updatePayoutCategory(req.body);
    res.json(responseUtil.getServiceResponse(payoutCategoryDto));
  } catch (error) {
    logger.error('Error updating payout category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating payout category details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutCategoryController.updateStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const payoutCategoryDto = await payoutCategoryService.updatePayoutCategoryStatus(id, status);
    if (payoutCategoryDto) {
      res.json(responseUtil.getServiceResponse(payoutCategoryDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Payout category not found', 404));
    }
  } catch (error) {
    logger.error('Error updating payout category status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating payout category status', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutCategoryController.getAllPayoutCategory() invoked');
    const categories = await payoutCategoryService.getAllPayoutCategory();
    res.json(responseUtil.getServiceResponse(categories));
  } catch (error) {
    logger.error('Error retrieving payout categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all payout category details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutCategoryController.getAllPagePayoutCategory() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.categoryName) searchParams.categoryName = req.query.categoryName;

    const result = await payoutCategoryService.getAllPagePayoutCategory(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving payout categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all payout category details', 500));
  }
});

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PayoutCategoryController.getAllPayoutCategoryByName() invoked');
    const payoutCategory = req.query.payoutCategory;
    const categories = await payoutCategoryService.getAllByName(payoutCategory);
    res.json(responseUtil.getServiceResponse(categories));
  } catch (error) {
    logger.error('Error retrieving payout category by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving payout category by name', 500));
  }
});

module.exports = router;
