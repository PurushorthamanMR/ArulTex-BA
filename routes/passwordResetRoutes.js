const express = require('express');
const router = express.Router();
const passwordResetService = require('../services/passwordResetService');
const responseUtil = require('../utils/responseUtil');
const logger = require('../config/logger');

router.post('/forgot-password', async (req, res) => {
  try {
    logger.info('PasswordResetController.forgotPassword() invoked');
    const result = await passwordResetService.forgotPassword(req.body);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error in forgot-password:', error);
    res.status(400).json(responseUtil.getErrorServiceResponse(error.message || 'Error processing forgot password request', 400));
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    logger.info('PasswordResetController.resetPassword() invoked');
    const result = await passwordResetService.resetPassword(req.body);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error in reset-password:', error);
    res.status(400).json(responseUtil.getErrorServiceResponse(error.message || 'Error resetting password', 400));
  }
});

module.exports = router;
