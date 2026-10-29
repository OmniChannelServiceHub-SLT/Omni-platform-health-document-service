const mongoose = require('mongoose');

/**
 * Audit trail for client/API telemetry. This is an operational record,
 * not a TMF business resource.
 */
const schema = new mongoose.Schema(
  {
    subscriberID: { type: String, index: true },
    packageID: String,
    api: String,
    method: String,
    path: String,
    ip: String,
    userAgent: String,
    receivedAt: { type: Date, default: Date.now }
  },
  { collection: 'client_api_logs' }
);

module.exports = mongoose.model('ClientAPILog', schema);