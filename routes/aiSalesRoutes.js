const express = require('express');
const router = express.Router();
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

router.post('/predict', authenticateToken, async (req, res) => {
  res.status(501).json(responseUtil.getErrorServiceResponse('Not implemented yet', 501));
});

module.exports = router;
