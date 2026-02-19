/**
 * Utility class for creating standardized API responses
 */
class ResponseUtil {
  /**
   * Create a successful response
   * @param {Object} data - Response data
   * @returns {Object} ResponseDto object
   */
  getServiceResponse(data) {
    return {
      status: true,
      errorCode: 0,
      errorDescription: null,
      responseDto: data
    };
  }

  /**
   * Create an error response
   * @param {String} errorMessage - Error message
   * @param {Number} errorCode - Error code (default: 500)
   * @returns {Object} ResponseDto object
   */
  getErrorServiceResponse(errorMessage, errorCode = 500) {
    return {
      status: false,
      errorCode: errorCode,
      errorDescription: errorMessage,
      responseDto: null
    };
  }

  /**
   * Create an exception response
   * @param {Error} error - Error object
   * @returns {Object} ResponseDto object
   */
  getExceptionServiceResponse(error) {
    return {
      status: false,
      errorCode: error.statusCode || 500,
      errorDescription: error.message || 'An error occurred',
      responseDto: null
    };
  }
}

module.exports = new ResponseUtil();
