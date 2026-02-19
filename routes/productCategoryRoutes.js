const express = require('express');
const router = express.Router();
const productCategoryService = require('../services/productCategoryService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductCategoryController.getAll() invoked');
    const categories = await productCategoryService.getAll();
    res.json(responseUtil.getServiceResponse(categories));
  } catch (error) {
    logger.error('Error retrieving product categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all product category details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductCategoryController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.productCategoryName) searchParams.productCategoryName = req.query.productCategoryName;

    const result = await productCategoryService.getAllPageProductCategory(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving product categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all product category details', 500));
  }
});

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductCategoryController.save() invoked');
    const categoryDto = await productCategoryService.save(req.body);
    res.json(responseUtil.getServiceResponse(categoryDto));
  } catch (error) {
    logger.error('Error saving product category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving product category details', 500));
  }
});

router.put('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductCategoryController.update() invoked');
    const categoryDto = await productCategoryService.update(req.body);
    res.json(responseUtil.getServiceResponse(categoryDto));
  } catch (error) {
    logger.error('Error updating product category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating product category details', 500));
  }
});

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductCategoryController.getAllProductCategoryByName() invoked');
    const productCategoryName = req.query.productCategoryName;
    const categories = await productCategoryService.getAllByName(productCategoryName);
    res.json(responseUtil.getServiceResponse(categories));
  } catch (error) {
    logger.error('Error retrieving product category by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving product category by name', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductCategoryController.updateInvoiceStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const categoryDto = await productCategoryService.updateProductCategoryStatus(id, status);
    if (categoryDto) {
      res.json(responseUtil.getServiceResponse(categoryDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Product category not found', 404));
    }
  } catch (error) {
    logger.error('Error updating product category status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating product category status', 500));
  }
});

module.exports = router;
