const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductController.save() invoked');
    const productDto = await productService.save(req.body);
    res.json(responseUtil.getServiceResponse(productDto));
  } catch (error) {
    logger.error('Error saving product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving product details', 500));
  }
});

router.get('/getAllPage', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.getAll() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.barcode) searchParams.barcode = req.query.barcode;

    const result = await productService.getAll(pageNumber, pageSize, searchParams, status);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving products:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all product details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.gellAllProducts() invoked');
    const products = await productService.getAllProducts();
    res.json(responseUtil.getServiceResponse(products));
  } catch (error) {
    logger.error('Error retrieving all products:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all product details', 500));
  }
});

router.get('/getByBarcode', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.getProductByBarcode() invoked');
    const barcode = req.query.barcode;
    const products = await productService.getProductByBarcode(barcode);
    res.json(responseUtil.getServiceResponse(products));
  } catch (error) {
    logger.error('Error retrieving product by barcode:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving product by barcode', 500));
  }
});

router.get('/getByName', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.getProductByName() invoked');
    const name = req.query.name;
    const products = await productService.getProductByName(name);
    res.json(responseUtil.getServiceResponse(products));
  } catch (error) {
    logger.error('Error retrieving product by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving product by name', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductController.updateProduct() invoked');
    const productDto = await productService.updateProduct(req.body);
    res.json(responseUtil.getServiceResponse(productDto));
  } catch (error) {
    logger.error('Error updating product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating product details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ProductController.updateProductStatus() invoked');
    const productId = parseInt(req.query.productId);
    const status = req.query.status === 'true';
    const productDto = await productService.updateProductStatus(productId, status);
    if (productDto) {
      res.json(responseUtil.getServiceResponse(productDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Product not found', 404));
    }
  } catch (error) {
    logger.error('Error updating product status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating product status', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.getProductById() invoked');
    const id = parseInt(req.query.id);
    const products = await productService.getProductById(id);
    res.json(responseUtil.getServiceResponse(products));
  } catch (error) {
    logger.error('Error retrieving product by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving product by ID', 500));
  }
});

router.get('/getByProductCategoryName', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.getByProductCategoryName() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const categoryName = req.query.categoryName;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    const result = await productService.getByProductCategoryName(pageNumber, pageSize, searchParams, categoryName, status);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving products by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products by category', 500));
  }
});

router.get('/getByTaxPercentage', authenticateToken, async (req, res) => {
  try {
    logger.info('ProductController.getByTaxPercentage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const taxPercentage = parseFloat(req.query.taxPercentage);
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    const result = await productService.getByTaxPercentage(pageNumber, pageSize, searchParams, taxPercentage, status);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving products by tax:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving products by tax percentage', 500));
  }
});

module.exports = router;
