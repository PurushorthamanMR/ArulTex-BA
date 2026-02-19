const express = require('express');
const router = express.Router();
const supplierService = require('../services/supplierService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.saveSupplier() invoked');
    const supplierDto = await supplierService.saveSupplier(req.body);
    res.json(responseUtil.getServiceResponse(supplierDto));
  } catch (error) {
    logger.error('Error saving supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving supplier details', 500));
  }
});

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.getSupplierByName() invoked');
    const name = req.query.name;
    const suppliers = await supplierService.getSupplierByName(name);
    res.json(responseUtil.getServiceResponse(suppliers));
  } catch (error) {
    logger.error('Error retrieving supplier by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving supplier by name', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.updateSuppplier() invoked');
    const supplierDto = await supplierService.updateSupplier(req.body);
    res.json(responseUtil.getServiceResponse(supplierDto));
  } catch (error) {
    logger.error('Error updating supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating supplier details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.updateSupplierStatus() invoked');
    const supplierId = parseInt(req.query.supplierId);
    const status = req.query.status === 'true';
    const supplierDto = await supplierService.updateSupplierStatus(supplierId, status);
    if (supplierDto) {
      res.json(responseUtil.getServiceResponse(supplierDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Supplier not found', 404));
    }
  } catch (error) {
    logger.error('Error updating supplier status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating supplier status', 500));
  }
});

router.get('/getById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.getSupplierById() invoked');
    const id = parseInt(req.query.id);
    const suppliers = await supplierService.getSupplierById(id);
    res.json(responseUtil.getServiceResponse(suppliers));
  } catch (error) {
    logger.error('Error retrieving supplier by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving supplier by ID', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.getAllSupplier() invoked');
    const suppliers = await supplierService.getAllSupplier();
    res.json(responseUtil.getServiceResponse(suppliers));
  } catch (error) {
    logger.error('Error retrieving suppliers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all supplier details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SupplierController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.contactNumber) searchParams.contactNumber = req.query.contactNumber;

    const result = await supplierService.getAllPageSupplier(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving suppliers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all supplier details', 500));
  }
});

module.exports = router;
