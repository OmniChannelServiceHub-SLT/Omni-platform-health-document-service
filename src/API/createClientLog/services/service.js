const ClientAPILog = require('../../../models/ClientAPILog');

exports.recordLog = async (entry) => {
  const log = new ClientAPILog(entry);
  return await log.save();
};