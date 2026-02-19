const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.save() invoked');
    const stockDto = await stockService.save(req.body);
    res.json(responseUtil.getServiceResponse(stockDto));
  } catch (error) {
    logger.error('Error saving stock:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving stock details', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.gellAllStock() invoked');
    const stocks = await stockService.getAllStock();
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stocks:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all stock details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};

    const result = await stockService.getAllPageStock(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving stocks:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all stock details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.updateStock() invoked');
    const stockDto = await stockService.updateStock(req.body);
    res.json(responseUtil.getServiceResponse(stockDto));
  } catch (error) {
    logger.error('Error updating stock:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating stock details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.updateStockStatus() invoked');
    const stockId = parseInt(req.query.stockId);
    const status = req.query.status === 'true';
    const stockDto = await stockService.updateStockStatus(stockId, status);
    if (stockDto) {
      res.json(responseUtil.getServiceResponse(stockDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Stock not found', 404));
    }
  } catch (error) {
    logger.error('Error updating stock status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating stock status', 500));
  }
});

router.get('/getById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getStockById() invoked');
    const id = parseInt(req.query.id);
    const stocks = await stockService.getStockById(id);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by ID', 500));
  }
});

router.get('/getByProductCategoryId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getByProductCategoryId() invoked');
    const productCategoryId = parseInt(req.query.productCategoryId);
    const stocks = await stockService.getStockByProductCategoryId(productCategoryId);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by product category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by product category', 500));
  }
});

router.get('/getByProductId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getByProductId() invoked');
    const productId = parseInt(req.query.productId);
    const stocks = await stockService.getStockByProductId(productId);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by product', 500));
  }
});

router.get('/getByQuantityRange', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getStockByQuantityRange() invoked');
    const minQuantity = parseFloat(req.query.minQuantity);
    const maxQuantity = parseFloat(req.query.maxQuantity);
    const stocks = await stockService.getStockByQuantityRange(minQuantity, maxQuantity);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by quantity range:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by quantity range', 500));
  }
});

module.exports = router;
