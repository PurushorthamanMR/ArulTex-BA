const express = require('express');
const router = express.Router();
const salesReportService = require('../services/salesReportService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('SalesReportController.save() invoked');
    const salesReportDto = await salesReportService.save(req.body);
    res.json(responseUtil.getServiceResponse(salesReportDto));
  } catch (error) {
    logger.error('Error saving sales report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving sales report details', 500));
  }
});

router.get('/getAllByXReports', authenticateToken, async (req, res) => {
  try {
    logger.info('SalesReportController.getXReports() invoked');
    const reports = await salesReportService.getXReports();
    res.json(responseUtil.getServiceResponse(reports));
  } catch (error) {
    logger.error('Error retrieving X reports:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving X reports', 500));
  }
});

router.get('/getAllByZReports', authenticateToken, async (req, res) => {
  try {
    logger.info('SalesReportController.getZReports() invoked');
    const reports = await salesReportService.getZReports();
    res.json(responseUtil.getServiceResponse(reports));
  } catch (error) {
    logger.error('Error retrieving Z reports:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving Z reports', 500));
  }
});

router.get('/getAllByZReportsPage', authenticateToken, async (req, res) => {
  try {
    logger.info('SalesReportController.getZReportsWithPagination() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const result = await salesReportService.getZReportsWithPagination(pageNumber, pageSize);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving Z reports with pagination:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving Z reports with pagination', 500));
  }
});

router.get('/getTotalCount', authenticateToken, async (req, res) => {
  try {
    logger.info('SalesReportController.getTotalCount() invoked');
    const reportType = req.query.reportType;
    const count = await salesReportService.getTotalCount(reportType);
    res.json(responseUtil.getServiceResponse(count));
  } catch (error) {
    logger.error('Error retrieving total count:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving total count', 500));
  }
});

module.exports = router;
