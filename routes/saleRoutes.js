const express = require('express');
const router = express.Router();
const saleService = require('../services/saleService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const { isDummyManager, getDummyManagerFactor, applyRevenueFactor } = require('../utils/dummyManagerUtil');
const logger = require('../config/logger');

const MANAGER_AND_DUMMY = ['ADMIN', 'MANAGER', 'STAFF', 'Dummy Manager'];

router.post('/save', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const body = { ...req.body, userId: req.user?.id ?? req.body.userId };
    const dto = await saleService.save(body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving sale', 500));
  }
});

router.post('/update', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const dto = await saleService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating sale', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    let list = await saleService.getAll();
    if (isDummyManager(req.userRole)) {
      list = applyRevenueFactor(list, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting sales:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving sales', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    let dto = await saleService.getById(id);
    if (isDummyManager(req.userRole)) {
      dto = applyRevenueFactor(dto, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting sale by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving sale', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    let list = await saleService.search(req.query);
    if (isDummyManager(req.userRole)) {
      list = applyRevenueFactor(list, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching sales:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching sales', 500));
  }
});

router.delete('/delete', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await saleService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting sale', 500));
  }
});

router.post('/return', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const dto = await saleService.processReturn(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error processing return:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error processing return', 500));
  }
});

router.get('/report/daily', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportDaily(req.query.date);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting daily report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving daily report', 500));
  }
});

router.get('/report/monthly', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportMonthly(req.query.year, req.query.month);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting monthly report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving monthly report', 500));
  }
});

router.get('/report/by-category', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportByCategory(req.query.fromDate, req.query.toDate);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting report by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving report', 500));
  }
});

router.get('/report/by-supplier', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportBySupplier(req.query.fromDate, req.query.toDate);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting report by supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving report', 500));
  }
});

router.get('/report/trends', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportTrends();
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting trends report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving trends report', 500));
  }
});

router.get('/report/top-products', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    let result = await saleService.reportTopProducts(limit);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting top products report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving top products report', 500));
  }
});

router.get('/report/profitability', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportProfitability();
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting profitability report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving profitability report', 500));
  }
});

router.get('/report/low-stock', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportLowStock();
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting low-stock report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving low-stock report', 500));
  }
});

module.exports = router;
