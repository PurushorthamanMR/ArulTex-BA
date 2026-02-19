const express = require('express');
const router = express.Router();
const userLogsService = require('../services/userLogsService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, async (req, res) => {
  try {
    logger.info('UserLogsController.save() invoked');
    const userLogDto = await userLogsService.save(req.body);
    res.json(responseUtil.getServiceResponse(userLogDto));
  } catch (error) {
    logger.error('Error saving user log:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving user log details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('UserLogsController.getAll() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    const searchParams = {};
    if (req.query.description) searchParams.description = req.query.description;

    const result = await userLogsService.getAllPageUserLogs(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving user logs:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all user log details', 500));
  }
});

module.exports = router;
