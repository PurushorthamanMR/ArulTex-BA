const express = require('express');
const router = express.Router();
const saleService = require('../services/saleService');
const zReportService = require('../services/zReportService');
const shiftService = require('../services/shiftService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const { isDummyManager, getDummyManagerFactor, applyRevenueFactor } = require('../utils/dummyManagerUtil');
const logger = require('../config/logger');

const MANAGER_AND_DUMMY = ['ADMIN', 'MANAGER', 'STAFF', 'Dummy Manager'];

router.post('/save', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const body = { ...req.body, userId: req.user?.id ?? req.body.userId };
    const dto = await saleService.save(body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving sale:', error);
    const msg = error.message || 'Error saving sale';
    const code = /no open shift/i.test(msg) ? 400 : 500;
    res.status(code).json(responseUtil.getErrorServiceResponse(msg, code));
  }
});

router.post('/update', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const dto = await saleService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating sale', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    let list = await saleService.getAll();
    if (isDummyManager(req.userRole)) {
      list = applyRevenueFactor(list, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error getting sales:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving sales', 500));
  }
});

router.get('/getById', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    let dto = await saleService.getById(id);
    if (isDummyManager(req.userRole)) {
      dto = applyRevenueFactor(dto, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting sale by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving sale', 500));
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  try {
    let list = await saleService.search(req.query);
    if (isDummyManager(req.userRole)) {
      list = applyRevenueFactor(list, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error searching sales:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error searching sales', 500));
  }
});

router.delete('/delete', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    await saleService.deleteById(id);
    res.json(responseUtil.getServiceResponse({ id }));
  } catch (error) {
    logger.error('Error deleting sale:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error deleting sale', 500));
  }
});

router.post('/return', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const dto = await saleService.processReturn(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error processing return:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error processing return', 500));
  }
});

router.get('/report/daily', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportDaily(req.query.date);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting daily report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving daily report', 500));
  }
});

router.get('/report/monthly', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportMonthly(req.query.year, req.query.month);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting monthly report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving monthly report', 500));
  }
});

router.get('/report/by-category', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportByCategory(req.query.fromDate, req.query.toDate);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting report by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving report', 500));
  }
});

router.get('/report/by-supplier', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportBySupplier(req.query.fromDate, req.query.toDate);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting report by supplier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving report', 500));
  }
});

router.get('/report/trends', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportTrends();
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting trends report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving trends report', 500));
  }
});

router.get('/report/top-products', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    let result = await saleService.reportTopProducts(limit);
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting top products report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving top products report', 500));
  }
});

router.get('/report/profitability', authenticateToken, async (req, res) => {
  try {
    let result = await saleService.reportProfitability();
    if (isDummyManager(req.userRole)) {
      result = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting profitability report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving profitability report', 500));
  }
});

router.get('/report/low-stock', authenticateToken, async (req, res) => {
  try {
    const result = await saleService.reportLowStock();
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error getting low-stock report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving low-stock report', 500));
  }
});

router.get('/report/xReport', authenticateToken, async (req, res) => {
  try {
    const useOpen = req.query.useOpenShift === '1' || req.query.useOpenShift === 'true';
    let shiftId = req.query.shiftId ? parseInt(req.query.shiftId, 10) : null;
    if (!Number.isFinite(shiftId)) shiftId = null;

    if (useOpen && shiftId == null) {
      try {
        const o = await shiftService.getOpenShift();
        shiftId = o ? o.id : null;
      } catch (shiftErr) {
        logger.warn('getOpenShift failed (xReport), using date range:', shiftErr.message || shiftErr);
        shiftId = null;
      }
    }

    // No open shift but client asked for shift scope → use date range (not empty / not 500)
    const result = await saleService.reportX(req.query.userId, req.query.fromDate, req.query.toDate, shiftId);
    if (useOpen && shiftId == null && result && typeof result === 'object') {
      result.shiftScopeUnavailable = true;
    }
    let payload = result;
    if (isDummyManager(req.userRole)) {
      payload = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(payload));
  } catch (error) {
    logger.error('Error getting xReport:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving xReport', 500));
  }
});

/** POST — Z closes current open shift, saves archive (one Z per shift). */
router.post('/report/zReport/close', authenticateToken, authorize(...MANAGER_AND_DUMMY), async (req, res) => {
  try {
    const dto = await zReportService.closeAndSave(req.user.id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving Z report:', error);
    const code = /No open shift|already closed/i.test(error.message || '') ? 400 : 500;
    res.status(code).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving Z report', code));
  }
});

router.get('/report/zReport/archives', authenticateToken, async (req, res) => {
  try {
    const list = await zReportService.listArchives(req.query.limit);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error listing Z report archives:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error listing Z reports', 500));
  }
});

router.get('/report/zReport/archive', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('id is required', 400));
    }
    const dto = await zReportService.getArchiveById(id);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error getting Z report archive:', error);
    const status = error.message === 'Z Report not found' ? 404 : 500;
    res.status(status).json(responseUtil.getErrorServiceResponse(error.message || 'Error retrieving Z report', status));
  }
});

router.get('/report/zReport', authenticateToken, async (req, res) => {
  try {
    const useOpen = req.query.useOpenShift === '1' || req.query.useOpenShift === 'true';
    let shiftId = req.query.shiftId ? parseInt(req.query.shiftId, 10) : null;
    if (!Number.isFinite(shiftId)) shiftId = null;

    if (useOpen && shiftId == null) {
      try {
        const o = await shiftService.getOpenShift();
        shiftId = o ? o.id : null;
      } catch (shiftErr) {
        logger.warn('getOpenShift failed (zReport), using date range:', shiftErr.message || shiftErr);
        shiftId = null;
      }
    }

    const result = await saleService.reportZ(req.query.userId, req.query.fromDate, req.query.toDate, shiftId);
    if (useOpen && shiftId == null && result && typeof result === 'object') {
      result.shiftScopeUnavailable = true;
    }
    let payload = result;
    if (isDummyManager(req.userRole)) {
      payload = applyRevenueFactor(result, getDummyManagerFactor());
    }
    res.json(responseUtil.getServiceResponse(payload));
  } catch (error) {
    logger.error('Error getting zReport:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving zReport', 500));
  }
});

module.exports = router;
