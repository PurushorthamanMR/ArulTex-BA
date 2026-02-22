const express = require('express');
const router = express.Router();
const supplierService = require('../services/supplierService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await supplierService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving supplier', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await supplierService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating supplier', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    const list = await supplierService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting suppliers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving suppliers', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await supplierService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting supplier by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving supplier', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await supplierService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching suppliers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching suppliers', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await supplierService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting supplier', 500));
  }
});

module.exports = router;
