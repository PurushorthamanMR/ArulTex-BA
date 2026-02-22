const express = require('express');
const router = express.Router();
const productCategoryService = require('../services/productCategoryService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await productCategoryService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving product category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving category', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await productCategoryService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating product category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating category', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    const list = await productCategoryService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting product categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving categories', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await productCategoryService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting product category by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving category', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await productCategoryService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching product categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching categories', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await productCategoryService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting product category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting category', 500));
  }
});

module.exports = router;
