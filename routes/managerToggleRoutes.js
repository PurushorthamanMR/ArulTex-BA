const express = require('express');
const router = express.Router();
const managerToggleService = require('../services/managerToggleService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('ManagerToggleController.save() invoked');
    const managerToggleDto = await managerToggleService.save(req.body);
    res.json(responseUtil.getServiceResponse(managerToggleDto));
  } catch (error) {
    logger.error('Error saving manager toggle:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving manager toggle details', 500));
  }
});

router.put('/update', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('ManagerToggleController.update() invoked');
    const managerToggleDto = await managerToggleService.update(req.body);
    res.json(responseUtil.getServiceResponse(managerToggleDto));
  } catch (error) {
    logger.error('Error updating manager toggle:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating manager toggle details', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('ManagerToggleController.updateStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const managerToggleDto = await managerToggleService.updateStatus(id, status);
    if (managerToggleDto) {
      res.json(responseUtil.getServiceResponse(managerToggleDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Manager toggle not found', 404));
    }
  } catch (error) {
    logger.error('Error updating manager toggle status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating manager toggle status', 500));
  }
});

router.put('/updateAdminStatus', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('ManagerToggleController.updateAdminStatus() invoked');
    const id = parseInt(req.query.id);
    const status = req.query.status === 'true';
    const managerToggleDto = await managerToggleService.updateAdminStatus(id, status);
    if (managerToggleDto) {
      res.json(responseUtil.getServiceResponse(managerToggleDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Manager toggle not found', 404));
    }
  } catch (error) {
    logger.error('Error updating manager toggle admin status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating manager toggle admin status', 500));
  }
});

router.get('/getAll', async (req, res) => {
  try {
    logger.info('ManagerToggleController.getAll() invoked');
    const toggles = await managerToggleService.getAll();
    res.json(responseUtil.getServiceResponse(toggles));
  } catch (error) {
    logger.error('Error retrieving manager toggles:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all manager toggle details', 500));
  }
});

router.get('/getByName', async (req, res) => {
  try {
    logger.info('ManagerToggleController.getByName() invoked');
    const action = req.query.action;
    const toggles = await managerToggleService.getByName(action);
    res.json(responseUtil.getServiceResponse(toggles));
  } catch (error) {
    logger.error('Error retrieving manager toggle by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving manager toggle by name', 500));
  }
});

module.exports = router;
