const express = require('express');
const router = express.Router();
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const { UserRole } = require('../models');
const logger = require('../config/logger');

router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  res.status(501).json(responseUtil.getErrorServiceResponse('Not implemented yet', 501));
});

/**
 * Get all user roles
 * GET /userRole/getAll
 */
router.get('/getAll', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('UserRoleController.getAll() invoked');
    const userRoles = await UserRole.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });
    
    const rolesDto = userRoles.map(role => ({
      id: role.id,
      userRole: role.userRole,
      isActive: role.isActive
    }));
    
    res.json(responseUtil.getServiceResponse(rolesDto));
  } catch (error) {
    logger.error('Error retrieving user roles:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving user roles', 500));
  }
});

module.exports = router;
