const express = require('express');
const router = express.Router();
const voidHistoryService = require('../services/voidHistoryService');
const responseUtil = require('../utils/responseUtil');
const logger = require('../config/logger');

router.post('/save', async (req, res) => {
  try {
    logger.info('VoidHistoryController.save() invoked');
    const voidHistoryDto = await voidHistoryService.save(req.body);
    res.json(responseUtil.getServiceResponse(voidHistoryDto));
  } catch (error) {
    logger.error('Error saving void history:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving void history details', 500));
  }
});

router.get('/getAll', async (req, res) => {
  try {
    logger.info('VoidHistoryController.getAll() invoked');
    const voidHistories = await voidHistoryService.getAll();
    res.json(responseUtil.getServiceResponse(voidHistories));
  } catch (error) {
    logger.error('Error retrieving void histories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all void history details', 500));
  }
});

router.get('/getAllPage', async (req, res) => {
  try {
    logger.info('VoidHistoryController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const searchParams = {};

    const result = await voidHistoryService.getAllPage(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving void histories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all void history details', 500));
  }
});

router.get('/getAllPageByDate', async (req, res) => {
  try {
    logger.info('VoidHistoryController.getAllPageByDate() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const date = req.query.date;
    
    const searchParams = {};

    const result = await voidHistoryService.getAllPageByDate(pageNumber, pageSize, date, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving void histories by date:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving void histories by date', 500));
  }
});

router.get('/getAllPageByUserId', async (req, res) => {
  try {
    logger.info('VoidHistoryController.getAllPageByUserId() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const userId = parseInt(req.query.userId);
    
    const searchParams = {};

    const result = await voidHistoryService.getAllPageByUserId(pageNumber, pageSize, userId, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving void histories by user:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving void histories by user', 500));
  }
});

module.exports = router;
