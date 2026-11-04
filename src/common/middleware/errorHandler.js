const { isTmfPath } = require('../utils/urlHelpers');

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Detect if request is targeting a TMF CTK route
  const isTmf = req.path.startsWith('/tmf-api/');

  if (isTmf) {
    // TMF error format (required by CTK)
    return res.status(status).json({
      code: err.code || status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      reason: err.reason || message,
      message: message,
      status: status,
      reference: req.headers['x-correlation-id'] || null,
    });
  }

  // Legacy error envelope
  return res.status(status).json({
    isSuccess: false,
    errorMessege: message,
    exceptionDetail: err.stack,
    dataBundle: null,
    errorShow: message,
    errorCode: err.code || null,
  });
};