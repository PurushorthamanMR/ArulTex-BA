const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/getByDateRange', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByDateRange() invoked');
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const transactions = await transactionService.getTransactionByDateRange(startDate, endDate);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by date range:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by date range', 500));
  }
});

router.get('/getByBranchId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByBranchId() invoked');
    const branchId = parseInt(req.query.branchId);
    const transactions = await transactionService.getTransactionByBranchId(branchId);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by branch:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by branch', 500));
  }
});

router.get('/getById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getById() invoked');
    const id = parseInt(req.query.id);
    const transactions = await transactionService.getTransactionById(id);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transaction by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transaction by ID', 500));
  }
});

router.get('/getByUserId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByUserId() invoked');
    const userId = parseInt(req.query.userId);
    const transactions = await transactionService.getTransactionByUserId(userId);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by user:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by user', 500));
  }
});

router.get('/getByCustomerId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByCustomerId() invoked');
    const customerId = parseInt(req.query.customerId);
    const transactions = await transactionService.getTransactionByCustomerId(customerId);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by customer', 500));
  }
});

router.get('/getByPaymentMethodId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByPaymentMethodId() invoked');
    const paymentMethodId = parseInt(req.query.paymentMethodId);
    const transactions = await transactionService.getTransactionByPaymentMethodId(paymentMethodId);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by payment method:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by payment method', 500));
  }
});

router.post('/save', authenticateToken, async (req, res) => {
  try {
    logger.info('TransactionController.save() invoked');
    const alertMessage = req.body.alertMessage;
    const transactionDto = await transactionService.save(req.body, alertMessage);
    res.json(responseUtil.getServiceResponse(transactionDto));
  } catch (error) {
    logger.error('Error saving transaction:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving transaction details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.update() invoked');
    const transactionDto = await transactionService.updateTransaction(req.body);
    res.json(responseUtil.getServiceResponse(transactionDto));
  } catch (error) {
    logger.error('Error updating transaction:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating transaction details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('TransactionController.getAll() invoked');
    const transactions = await transactionService.getAllTransaction();
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all transaction details', 500));
  }
});

router.get('/getByStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByStatus() invoked');
    const isActive = req.query.isActive === 'true';
    const transactions = await transactionService.getTransactionByStatus(isActive);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by status', 500));
  }
});

router.get('/getByProductId', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransactionController.getByProductId() invoked');
    const productId = parseInt(req.query.productId);
    const transactions = await transactionService.getTransactionByProductId(productId);
    res.json(responseUtil.getServiceResponse(transactions));
  } catch (error) {
    logger.error('Error retrieving transactions by product:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transactions by product', 500));
  }
});

router.get('/xReport', authenticateToken, async (req, res) => {
  try {
    logger.info('TransactionController.xReport() invoked');
    const userId = parseInt(req.query.userId);
    const report = await transactionService.getXReport(userId);
    res.json(responseUtil.getServiceResponse(report));
  } catch (error) {
    logger.error('Error generating X report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error generating X report', 500));
  }
});

router.get('/zReport', authenticateToken, async (req, res) => {
  try {
    logger.info('TransactionController.zReport() invoked');
    const userId = parseInt(req.query.userId);
    const report = await transactionService.getZReport(userId);
    res.json(responseUtil.getServiceResponse(report));
  } catch (error) {
    logger.error('Error generating Z report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error generating Z report', 500));
  }
});

router.get('/getAllPage', authenticateToken, async (req, res) => {
  try {
    logger.info('TransactionController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const searchParams = {};

    const result = await transactionService.getAllPageTransaction(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving transactions:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all transaction details', 500));
  }
});

router.get('/getCashTotal', authenticateToken, async (req, res) => {
  try {
    logger.info('TransactionController.getCashTotal() invoked');
    const userId = parseInt(req.query.userId);
    const cashTotal = await transactionService.getCashTotal(userId);
    res.json(responseUtil.getServiceResponse(cashTotal));
  } catch (error) {
    logger.error('Error retrieving cash total:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving cash total', 500));
  }
});

module.exports = router;
