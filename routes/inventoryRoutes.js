const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await inventoryService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving inventory transaction:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving inventory transaction', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await inventoryService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating inventory transaction:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating inventory transaction', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    const list = await inventoryService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting inventory transactions:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving inventory transactions', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await inventoryService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting inventory transaction by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving inventory transaction', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await inventoryService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching inventory transactions:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching inventory transactions', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await inventoryService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting inventory transaction:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting inventory transaction', 500));
  }
});

router.post('/adjust', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await inventoryService.adjust(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error adjusting inventory:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error adjusting inventory', 500));
  }
});

module.exports = router;
