const express = require('express');
const router = express.Router();
const staffLeaveService = require('../services/staffLeaveService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StaffLeaveController.save() invoked');
    const staffLeaveDto = await staffLeaveService.save(req.body);
    res.json(responseUtil.getServiceResponse(staffLeaveDto));
  } catch (error) {
    logger.error('Error saving staff leave:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving staff leave details', 500));
  }
});

router.put('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StaffLeaveController.update() invoked');
    const staffLeaveDto = await staffLeaveService.update(req.body);
    res.json(responseUtil.getServiceResponse(staffLeaveDto));
  } catch (error) {
    logger.error('Error updating staff leave:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating staff leave details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StaffLeaveController.updateStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const staffLeaveDto = await staffLeaveService.updateStatus(id, status);
    if (staffLeaveDto) {
      res.json(responseUtil.getServiceResponse(staffLeaveDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Staff leave not found', 404));
    }
  } catch (error) {
    logger.error('Error updating staff leave status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating staff leave status', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StaffLeaveController.getAll() invoked');
    const staffLeaves = await staffLeaveService.getAll();
    res.json(responseUtil.getServiceResponse(staffLeaves));
  } catch (error) {
    logger.error('Error retrieving staff leaves:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all staff leave details', 500));
  }
});

router.get('/getAllPage', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StaffLeaveController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};

    const result = await staffLeaveService.getAllPageStaffLeave(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving staff leaves:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all staff leave details', 500));
  }
});

router.post('/sendEmail', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('StaffLeaveController.sendEmail() invoked');
    const { to, subject, body } = req.body;
    const result = await staffLeaveService.sendEmail(to, subject, body);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error sending email', 500));
  }
});

module.exports = router;
