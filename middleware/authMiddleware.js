const jwtUtil = require('../utils/jwtUtil');
const responseUtil = require('../utils/responseUtil');
const logger = require('../config/logger');
const { User } = require('../models');

/**
 * JWT Authentication Middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('JWT token is missing', 401)
      );
    }

    if (!jwtUtil.validateToken(token)) {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('JWT token is invalid or expired', 401)
      );
    }

    const username = jwtUtil.extractUsername(token);
    if (!username) {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('Invalid token payload', 401)
      );
    }

    // Load user details (UserRole only; Branch not in use in this app)
    const { UserRole } = require('../models');
    const user = await User.findOne({ 
      where: { emailAddress: username, isActive: true },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    if (!user) {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('User not found or inactive', 401)
      );
    }

    // Attach user to request
    req.user = user;
    req.userRole = user.userRole?.userRole || null;
    
    logger.info(`User authenticated: ${user.emailAddress}, Role: ${req.userRole}`);
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('JWT token expired', 401)
      );
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('JWT token is invalid (signature or format)', 401)
      );
    }
    return res.status(401).json(
      responseUtil.getErrorServiceResponse(error.message || 'JWT token is invalid', 401)
    );
  }
};

/**
 * Role-based authorization middleware
 * @param {Array<String>} allowedRoles - Array of allowed role names
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        responseUtil.getErrorServiceResponse('Authentication required', 401)
      );
    }

    const userRole = req.userRole ? req.userRole.toUpperCase() : null;
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());
    
    logger.info(`Authorization check - User role: ${userRole}, Allowed roles: ${normalizedAllowedRoles.join(', ')}`);
    
    if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
      logger.warn(`Access denied - User role '${userRole}' not in allowed roles: ${normalizedAllowedRoles.join(', ')}`);
      return res.status(403).json(
        responseUtil.getErrorServiceResponse('Insufficient permissions', 403)
      );
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize
};
