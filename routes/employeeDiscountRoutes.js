const express = require('express');
const router = express.Router();
const employeeDiscountService = require('../services/employeeDiscountService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('EmployeeDiscountController.save() invoked');
    const employeeDiscountDto = await employeeDiscountService.save(req.body);
    res.json(responseUtil.getServiceResponse(employeeDiscountDto));
  } catch (error) {
    logger.error('Error saving employee discount:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving employee discount details', 500));
  }
});

router.put('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('EmployeeDiscountController.update() invoked');
    const employeeDiscountDto = await employeeDiscountService.update(req.body);
    res.json(responseUtil.getServiceResponse(employeeDiscountDto));
  } catch (error) {
    logger.error('Error updating employee discount:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating employee discount details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('EmployeeDiscountController.getAll() invoked');
    const employeeDiscounts = await employeeDiscountService.getAll();
    res.json(responseUtil.getServiceResponse(employeeDiscounts));
  } catch (error) {
    logger.error('Error retrieving employee discounts:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all employee discount details', 500));
  }
});

module.exports = router;
