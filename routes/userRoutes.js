const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Register a new user
 * POST /user/register
 */
router.post('/register', async (req, res) => {
  try {
    logger.info('UserController.registerUser() invoked');
    const userDto = await userService.registerUser(req.body);
    res.json(responseUtil.getServiceResponse(userDto));
  } catch (error) {
    logger.error('Error registering user:', error);
    if (error.message.includes('already exists')) {
      res.status(400).json(responseUtil.getErrorServiceResponse(error.message, 400));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse('Error saving user details', 500));
    }
  }
});

/**
 * Login user
 * POST /user/login
 */
router.post('/login', async (req, res) => {
  try {
    logger.info('UserController.login() invoked');
    const jwtResponse = await userService.login(req.body);
    res.json(responseUtil.getServiceResponse(jwtResponse));
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(401).json(responseUtil.getErrorServiceResponse(error.message || 'Invalid credentials', 401));
  }
});

/**
 * Get admin message (test endpoint)
 * POST /user/admin
 */
router.post('/admin', authenticateToken, authorize('DEV', 'ADMIN'), (req, res) => {
  res.json(responseUtil.getServiceResponse('Hi from admin !!!'));
});

/**
 * Get user message (test endpoint)
 * POST /user/user
 */
router.post('/user', authenticateToken, authorize('USER'), (req, res) => {
  res.json(responseUtil.getServiceResponse('Hi from user !!!'));
});

/**
 * Get all users with pagination
 * GET /user/getAllPage
 */
router.get('/getAllPage', authenticateToken, async (req, res) => {
  try {
    logger.info('UserController.getAll() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    
    // Extract search parameters
    const searchParams = {};
    if (req.query.firstName) searchParams.firstName = req.query.firstName;
    if (req.query.lastName) searchParams.lastName = req.query.lastName;
    if (req.query.emailAddress) searchParams.emailAddress = req.query.emailAddress;

    const result = await userService.getAll(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving users:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving all user details', 500));
  }
});

/**
 * Get user by name
 * GET /user/getByName
 */
router.get('/getByName', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserController.getUserByName() invoked');
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const users = await userService.getUserByName(firstName, lastName);
    res.json(responseUtil.getServiceResponse(users));
  } catch (error) {
    logger.error('Error retrieving user by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving user by name', 500));
  }
});

/**
 * Get user by ID
 * GET /user/getById
 */
router.get('/getById', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserController.getUserById() invoked');
    const id = parseInt(req.query.id);
    const users = await userService.getUserById(id);
    res.json(responseUtil.getServiceResponse(users));
  } catch (error) {
    logger.error('Error retrieving user by ID:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving user by ID', 500));
  }
});

/**
 * Get users by role
 * GET /user/getByRole
 */
router.get('/getByRole', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserController.getUserByRole() invoked');
    const userRole = req.query.userRole;
    const users = await userService.getUserByRole(userRole);
    res.json(responseUtil.getServiceResponse(users));
  } catch (error) {
    logger.error('Error retrieving users by role:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving users by role', 500));
  }
});

/**
 * Update user details
 * POST /user/update
 */
router.post('/update', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserController.updateUserDetails() invoked');
    const userDto = await userService.updateUserDetails(req.body);
    res.json(responseUtil.getServiceResponse(userDto));
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating user details', 500));
  }
});

/**
 * Update user status
 * PUT /user/updateStatus
 */
router.put('/updateStatus', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserController.updateInvoiceStatus() invoked');
    const userId = parseInt(req.query.userId);
    const status = req.query.status === 'true';
    const userDto = await userService.updateUserStatus(userId, status);
    if (userDto) {
      res.json(responseUtil.getServiceResponse(userDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('User not found', 404));
    }
  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating user status', 500));
  }
});

/**
 * Update password
 * PUT /user/updatePassword
 */
router.put('/updatePassword', authenticateToken, authorize('DEV', 'ADMIN', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserController.updatePassword() invoked');
    const userId = parseInt(req.query.userId);
    const password = req.query.password;
    const changedByUserId = parseInt(req.query.changedByUserId);
    const userDto = await userService.updatePassword(userId, password, changedByUserId);
    if (userDto) {
      res.json(responseUtil.getServiceResponse(userDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('User not found', 404));
    }
  } catch (error) {
    logger.error('Error updating password:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating password', 500));
  }
});

/**
 * Get user by email address
 * GET /user/getByEmailAddress
 */
router.get('/getByEmailAddress', async (req, res) => {
  try {
    logger.info('UserController.getUserByEmailAddress() invoked');
    const emailAddress = req.query.emailAddress;
    const users = await userService.getUserByEmailAddress(emailAddress);
    res.json(responseUtil.getServiceResponse(users));
  } catch (error) {
    logger.error('Error retrieving user by email:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving user by email', 500));
  }
});

module.exports = router;
