const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || '357638792F423F4428472B4B6250655368566D597133743677397A2443264629';

class JwtUtil {
  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @returns {String} JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      // Note: Original implementation had tokens that never expire
      // Adjust expiration as needed
      // expiresIn: '24h'
    });
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('JWT verification failed:', error);
      throw error;
    }
  }

  /**
   * Extract username from token
   * @param {String} token - JWT token
   * @returns {String} Username
   */
  extractUsername(token) {
    try {
      const decoded = this.verifyToken(token);
      return decoded.sub || decoded.username || decoded.emailAddress;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract expiration date from token
   * @param {String} token - JWT token
   * @returns {Date} Expiration date
   */
  extractExpiration(token) {
    try {
      const decoded = this.verifyToken(token);
      return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate token
   * @param {String} token - JWT token
   * @returns {Boolean} True if valid
   */
  validateToken(token) {
    try {
      this.verifyToken(token);
      // Original implementation had tokens that never expire
      // const expiration = this.extractExpiration(token);
      // return expiration ? expiration > new Date() : true;
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new JwtUtil();
