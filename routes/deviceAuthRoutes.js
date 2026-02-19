const express = require('express');
const router = express.Router();
const deviceAuthService = require('../services/deviceAuthService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/register', async (req, res) => {
  try {
    logger.info('DeviceAuthController.registerDeviceAuth() invoked');
    const deviceAuthDto = await deviceAuthService.registerDeviceAuth(req.body);
    res.json(responseUtil.getServiceResponse(deviceAuthDto));
  } catch (error) {
    logger.error('Error registering device auth:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error registering device auth', 500));
  }
});

router.put('/approve', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('DeviceAuthController.approveDeviceAuth() invoked');
    const id = parseInt(req.query.id);
    const deviceAuthDto = await deviceAuthService.approveDeviceAuth(id);
    res.json(responseUtil.getServiceResponse(deviceAuthDto));
  } catch (error) {
    logger.error('Error approving device auth:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error approving device auth', 500));
  }
});

router.put('/decline', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('DeviceAuthController.declineDeviceAuth() invoked');
    const id = parseInt(req.query.id);
    const deviceAuthDto = await deviceAuthService.declineDeviceAuth(id);
    res.json(responseUtil.getServiceResponse(deviceAuthDto));
  } catch (error) {
    logger.error('Error declining device auth:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error declining device auth', 500));
  }
});

router.put('/block', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('DeviceAuthController.blockDeviceAuth() invoked');
    const id = parseInt(req.query.id);
    const deviceAuthDto = await deviceAuthService.blockDeviceAuth(id);
    res.json(responseUtil.getServiceResponse(deviceAuthDto));
  } catch (error) {
    logger.error('Error blocking device auth:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error blocking device auth', 500));
  }
});

router.post('/login', async (req, res) => {
  try {
    logger.info('DeviceAuthController.loginDeviceAuth() invoked');
    const tillId = req.body.tillId;
    const deviceAuthDto = await deviceAuthService.loginDeviceAuth(tillId);
    res.json(responseUtil.getServiceResponse(deviceAuthDto));
  } catch (error) {
    logger.error('Error logging in device auth:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error logging in device auth', 500));
  }
});

router.get('/getAllPending', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('DeviceAuthController.getAllPending() invoked');
    const deviceAuths = await deviceAuthService.getAllPending();
    res.json(responseUtil.getServiceResponse(deviceAuths));
  } catch (error) {
    logger.error('Error retrieving pending device auths:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving pending device auths', 500));
  }
});

router.get('/getAll', authenticateToken, authorize('DEV', 'ADMIN'), async (req, res) => {
  try {
    logger.info('DeviceAuthController.getAll() invoked');
    const deviceAuths = await deviceAuthService.getAll();
    res.json(responseUtil.getServiceResponse(deviceAuths));
  } catch (error) {
    logger.error('Error retrieving device auths:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all device auths', 500));
  }
});

router.get('/getByTillName', async (req, res) => {
  try {
    logger.info('DeviceAuthController.getByTillName() invoked');
    const tillName = req.query.tillName;
    const deviceAuths = await deviceAuthService.getByTillName(tillName);
    res.json(responseUtil.getServiceResponse(deviceAuths));
  } catch (error) {
    logger.error('Error retrieving device auth by till name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving device auth by till name', 500));
  }
});

router.get('/getByTillId', async (req, res) => {
  try {
    logger.info('DeviceAuthController.getByTillId() invoked');
    const tillId = req.query.tillId;
    const deviceAuths = await deviceAuthService.getByTillId(tillId);
    res.json(responseUtil.getServiceResponse(deviceAuths));
  } catch (error) {
    logger.error('Error retrieving device auth by till ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving device auth by till ID', 500));
  }
});

router.put('/updateTillName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('DeviceAuthController.updateTillName() invoked');
    const id = parseInt(req.query.id);
    const tillName = req.query.tillName;
    const deviceAuthDto = await deviceAuthService.updateTillName(id, tillName);
    res.json(responseUtil.getServiceResponse(deviceAuthDto));
  } catch (error) {
    logger.error('Error updating till name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating till name', 500));
  }
});

module.exports = router;
