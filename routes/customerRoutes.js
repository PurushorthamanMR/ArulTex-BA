const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getCustomerBySearch() invoked');
    const name = req.query.name;
    const customers = await customerService.getCustomerBySearch(name);
    res.json(responseUtil.getServiceResponse(customers));
  } catch (error) {
    logger.error('Error retrieving customer by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by name', 500));
  }
});

router.get('/getByMobileNumber', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getCustomerByMobileNumber() invoked');
    const mobileNumber = req.query.mobileNumber;
    const customers = await customerService.getCustomerByMobileNumber(mobileNumber);
    res.json(responseUtil.getServiceResponse(customers));
  } catch (error) {
    logger.error('Error retrieving customer by mobile:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by mobile number', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.mobileNumber) searchParams.mobileNumber = req.query.mobileNumber;

    const result = await customerService.getAllPageCustomer(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving customers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all customer details', 500));
  }
});

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.saveCustomer() invoked');
    const customerDto = await customerService.saveCustomer(req.body);
    res.json(responseUtil.getServiceResponse(customerDto));
  } catch (error) {
    logger.error('Error saving customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving customer details', 500));
  }
});

router.get('/getById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getCustomerById() invoked');
    const id = parseInt(req.query.id);
    const customers = await customerService.getCustomerById(id);
    res.json(responseUtil.getServiceResponse(customers));
  } catch (error) {
    logger.error('Error retrieving customer by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by ID', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.updateCustomer() invoked');
    const customerDto = await customerService.updateCustomer(req.body);
    res.json(responseUtil.getServiceResponse(customerDto));
  } catch (error) {
    logger.error('Error updating customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating customer details', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getAll() invoked');
    const customers = await customerService.getAllCustomer();
    res.json(responseUtil.getServiceResponse(customers));
  } catch (error) {
    logger.error('Error retrieving all customers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all customer details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.updateCustomerStatus() invoked');
    const customerId = parseInt(req.query.customerId);
    const status = req.query.status === 'true';
    const customerDto = await customerService.updateCustomerStatus(customerId, status);
    if (customerDto) {
      res.json(responseUtil.getServiceResponse(customerDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Customer not found', 404));
    }
  } catch (error) {
    logger.error('Error updating customer status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating customer status', 500));
  }
});

module.exports = router;
