const service = require('../services/service');

exports.logAPIFront = async (req, res, next) => {
  try {
    const subscriberID =
      req.query.subscriberID || req.body?.subscriberID;
    const packageID =
      req.query.packageID || req.body?.packageID;
    const api =
      req.query.api || req.body?.api;

    // Fire-and-forget — the legacy contract returns dataBundle: null
    // on success, and downstream callers do not wait for log persistence.
    // If persistence fails, log to console but do not fail the request.
    try {
      await service.recordLog({
        subscriberID,
        packageID,
        api,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (logErr) {
      console.error('[LogAPIFront] persistence failed:', logErr.message);
    }

    return res.status(200).json({
      isSuccess: true,
      errorMessege: null,
      exceptionDetail: null,
      dataBundle: null,
      errorShow: null,
      errorCode: null
    });
  } catch (err) {
    next(err);
  }
};