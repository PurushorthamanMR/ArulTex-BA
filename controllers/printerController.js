const responseUtil = require('../utils/responseUtil');
const printerService = require('../services/printerService');

async function printZpl(req, res) {
  try {
    const zpl = req.body?.zpl;
    const result = await printerService.printZpl(zpl);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    const code = error.message && error.message.includes('not configured') ? 503 : 500;
    res.status(code).json(responseUtil.getErrorServiceResponse(error.message || 'Print failed', code));
  }
}

async function printEpl(req, res) {
  try {
    const epl = req.body?.epl;
    const result = await printerService.printEpl(epl);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    const code = error.message && error.message.includes('not configured') ? 503 : 500;
    res.status(code).json(responseUtil.getErrorServiceResponse(error.message || 'Print failed', code));
  }
}

module.exports = {
  printZpl,
  printEpl
};
