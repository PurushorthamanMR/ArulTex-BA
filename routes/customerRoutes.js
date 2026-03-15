const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await customerService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving customer', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await customerService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating customer', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    const list = await customerService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting customers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customers', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await customerService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting customer by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await customerService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching customers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching customers', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await customerService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting customer', 500));
  }
});

module.exports = router;
