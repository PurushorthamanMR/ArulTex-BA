const express = require('express');
const router = express.Router();
const purchaseListService = require('../services/purchaseListService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, async (req, res) => {
  try {
    logger.info('PurchaseListController.savePurchaseList() invoked');
    const purchaseListDto = await purchaseListService.savePurchaseList(req.body);
    res.json(responseUtil.getServiceResponse(purchaseListDto));
  } catch (error) {
    logger.error('Error saving purchase list:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving purchase list details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('PurchaseListController.getAll() invoked');
    const purchaseLists = await purchaseListService.getAll();
    res.json(responseUtil.getServiceResponse(purchaseLists));
  } catch (error) {
    logger.error('Error retrieving purchase lists:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all purchase list details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PurchaseListController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const searchParams = {};

    const result = await purchaseListService.getAllPagePurchaseList(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving purchase lists:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all purchase list details', 500));
  }
});

router.delete('/deleteAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PurchaseListController.deleteAll() invoked');
    const result = await purchaseListService.deleteAll();
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error deleting all purchase lists:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error deleting all purchase lists', 500));
  }
});

router.delete('/deleteById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('PurchaseListController.deleteById() invoked');
    const id = parseInt(req.query.id);
    const result = await purchaseListService.deleteById(id);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error deleting purchase list by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error deleting purchase list by ID', 500));
  }
});

module.exports = router;
