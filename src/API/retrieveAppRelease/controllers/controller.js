const service = require('../services/service');

exports.checkAppUpdate = async (req, res, next) => {
  try {
    const vCode = req.query.vCode || req.body?.vCode;
    const osType = req.query.osType || req.body?.osType;

    if (vCode === undefined || osType === undefined) {
      return res.status(400).json({
        isSuccess: false,
        errorMessege: 'vCode and osType are required',
        exceptionDetail: null,
        dataBundle: null,
        errorShow: null,
        errorCode: 'MISSING_PARAMETER'
      });
    }

    const config = await service.getReleaseConfig(osType);

    // No configured release for this OS → no update
    if (!config) {
      return res.status(200).json({
        isSuccess: true,
        errorMessege: null,
        exceptionDetail: null,
        dataBundle: { isNeedToUpdate: 'N', flag: 'N' },
        errorShow: null,
        errorCode: null
      });
    }

    const clientVCode = Number(vCode);
    const needsUpdate = clientVCode < config.latestVCode;
    const flag = needsUpdate && config.forceUpdate ? 'Y' : 'N';

    return res.status(200).json({
      isSuccess: true,
      errorMessege: null,
      exceptionDetail: null,
      dataBundle: {
        isNeedToUpdate: needsUpdate ? 'Y' : 'N',
        flag
      },
      errorShow: null,
      errorCode: null
    });
  } catch (err) {
    next(err);
  }
};