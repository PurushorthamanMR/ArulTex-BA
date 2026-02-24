const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await productService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving product', 500));
  }
});

router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const dto = await productService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating product', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    const list = await productService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting products:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products', 500));
  }
});

router.get('/getAllPaginated', authenticateToken, async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await productService.getAllPaginated(pageNumber, pageSize, req.query);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting products paginated:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const dto = await productService.getById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting product by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving product', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const list = await productService.search(req.query);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching products:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching products', 500));
  }
});

router.get('/getByCategory', authenticateToken, async (req, res) => {
  try {
    const categoryId = parseInt(req.query.categoryId);
    const list = await productService.getByCategory(categoryId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting products by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products', 500));
  }
});

router.get('/getByCategoryPaginated', authenticateToken, async (req, res) => {
  try {
    const categoryId = parseInt(req.query.categoryId);
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await productService.getByCategoryPaginated(categoryId, pageNumber, pageSize, req.query);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting products by category (paginated):', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products', 500));
  }
});

router.get('/getLowStock', authenticateToken, async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly !== 'false';
    const list = await productService.getLowStock(activeOnly);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting low-stock products:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving low-stock products', 500));
  }
});

router.get('/getLowStockPaginated', authenticateToken, async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await productService.getLowStockPaginated(pageNumber, pageSize, req.query);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting low-stock products (paginated):', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving low-stock products', 500));
  }
});

router.get('/getByPrice', authenticateToken, async (req, res) => {
  try {
    const minPrice = req.query.minPrice != null ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice != null ? parseFloat(req.query.maxPrice) : null;
    const list = await productService.getByPrice(minPrice, maxPrice);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting products by price:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products', 500));
  }
});

router.delete('/delete', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await productService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting product', 500));
  }
});

module.exports = router;
