const express = require('express');
const router = express.Router();
const branchService = require('../services/branchService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

router.get('/getAllPage', authenticateToken, async (req, res) => {
  try {
    logger.info('BranchController.getAll() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const searchParams = {};
    if (req.query.branchName) searchParams.branchName = req.query.branchName;
    if (req.query.branchCode) searchParams.branchCode = req.query.branchCode;
    if (req.query.status !== undefined) searchParams.status = req.query.status;

    const result = await branchService.getAll(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving branches:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all branch details', 500));
  }
});

router.get('/getAll', authenticateToken, async (req, res) => {
  try {
    logger.info('BranchController.gellAllBranches() invoked');
    const branches = await branchService.getAllBranches();
    res.json(responseUtil.getServiceResponse(branches));
  } catch (error) {
    logger.error('Error retrieving all branches:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all branch details', 500));
  }
});

router.post('/save', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('BranchController.save() invoked');
    const branchDto = await branchService.save(req.body);
    res.json(responseUtil.getServiceResponse(branchDto));
  } catch (error) {
    logger.error('Error saving branch:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving branch details', 500));
  }
});

router.get('/getAllBySBUid', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('BranchController.gellAllBranchesBySBU() invoked');
    const sbuId = parseInt(req.query.sbuId);
    const branches = await branchService.getAllBranchesBySbuId(sbuId);
    res.json(responseUtil.getServiceResponse(branches));
  } catch (error) {
    logger.error('Error retrieving branches by SBU:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving branches by SBU', 500));
  }
});

router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('BranchController.updateBranch() invoked');
    const branchDto = await branchService.updateBranch(req.body);
    res.json(responseUtil.getServiceResponse(branchDto));
  } catch (error) {
    logger.error('Error updating branch:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating branch details', 500));
  }
});

router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('BranchController.getBranchByName() invoked');
    const branchName = req.query.branchName;
    const branches = await branchService.getBranchByName(branchName);
    res.json(responseUtil.getServiceResponse(branches));
  } catch (error) {
    logger.error('Error retrieving branch by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving branch by name', 500));
  }
});

router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('BranchController.updateInvoiceStatus() invoked');
    const branchId = parseInt(req.query.branchId);
    const status = req.query.status === 'true';
    const branchDto = await branchService.updateBranchStatus(branchId, status);
    if (branchDto) {
      res.json(responseUtil.getServiceResponse(branchDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Branch not found', 404));
    }
  } catch (error) {
    logger.error('Error updating branch status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating branch status', 500));
  }
});

router.get('/getById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('BranchController.getBranchById() invoked');
    const id = parseInt(req.query.id);
    const branches = await branchService.getBranchById(id);
    res.json(responseUtil.getServiceResponse(branches));
  } catch (error) {
    logger.error('Error retrieving branch by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving branch by ID', 500));
  }
});

module.exports = router;
