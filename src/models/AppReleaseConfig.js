const mongoose = require('mongoose');

/**
 * Latest known app release per OS platform. One document per osType.
 * Admin tooling seeds this; there is no API to update it yet.
 */
const schema = new mongoose.Schema(
  {
    osType: { type: String, required: true, unique: true, index: true },
    latestVCode: { type: Number, required: true },
    forceUpdate: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'app_release_config' }
);

module.exports = mongoose.model('AppReleaseConfig', schema);