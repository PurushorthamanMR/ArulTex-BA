const express = require('express');
const router = express.Router();
const saleService = require('../services/saleService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await saleService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving sale', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
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
    const list = await saleService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting sales:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving sales', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await saleService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting sale by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving sale', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await saleService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching sales:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching sales', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await saleService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting sale', 500));
  }
});

router.post('/return', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
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
    const result = await saleService.reportDaily(req.query.date);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting daily report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving daily report', 500));
  }
});

router.get('/report/monthly', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportMonthly(req.query.year, req.query.month);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting monthly report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving monthly report', 500));
  }
});

router.get('/report/by-category', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportByCategory(req.query.fromDate, req.query.toDate);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting report by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving report', 500));
  }
});

router.get('/report/by-supplier', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportBySupplier(req.query.fromDate, req.query.toDate);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting report by supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving report', 500));
  }
});

router.get('/report/yearly', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportYearly(req.query.year);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting yearly report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving yearly report', 500));
  }
});

router.get('/report/trends', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportTrend();
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting trends report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving trends report', 500));
  }
});

module.exports = router;
