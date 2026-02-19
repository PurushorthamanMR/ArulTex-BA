const express = require('express');
const router = express.Router();
const shiftsService = require('../services/shiftsService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShiftsController.save() invoked');
    const shiftsDto = await shiftsService.save(req.body);
    res.json(responseUtil.getServiceResponse(shiftsDto));
  } catch (error) {
    logger.error('Error saving shift:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving shift details', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShiftsController.update() invoked');
    const shiftsDto = await shiftsService.update(req.body);
    res.json(responseUtil.getServiceResponse(shiftsDto));
  } catch (error) {
    logger.error('Error updating shift:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating shift details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShiftsController.updateStatus() invoked');
    const shiftId = parseInt(req.query.shiftId);
    const status = req.query.status === 'true';
    const shiftsDto = await shiftsService.updateStatus(shiftId, status);
    if (shiftsDto) {
      res.json(responseUtil.getServiceResponse(shiftsDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Shift not found', 404));
    }
  } catch (error) {
    logger.error('Error updating shift status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating shift status', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShiftsController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};

    const result = await shiftsService.getAllPageShifts(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving shifts:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all shift details', 500));
  }
});

router.get('/getAllByDateRange', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShiftsController.getAllByDateRange() invoked');
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const shifts = await shiftsService.getAllByDateRange(startDate, endDate);
    res.json(responseUtil.getServiceResponse(shifts));
  } catch (error) {
    logger.error('Error retrieving shifts by date range:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving shifts by date range', 500));
  }
});

module.exports = router;
