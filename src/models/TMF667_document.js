const mongoose = require('mongoose');

/**
 * TMF667 Document. Multipart bytes are stored on disk; this record holds
 * the metadata and a reference (attachment.url) to the file.
 */
const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    href: String,
    '@type': { type: String, default: 'Document' },
    '@baseType': { type: String, default: 'Document' },
    '@schemaLocation': String,

    name: String,
    description: String,
    documentType: String,

    // TMF667 Attachment structure — file metadata + reference
    attachment: mongoose.Schema.Types.Mixed,

    documentCharacteristic: [mongoose.Schema.Types.Mixed],
    relatedObject: mongoose.Schema.Types.Mixed,
    relatedParty: [mongoose.Schema.Types.Mixed]
  },
  { timestamps: true }
);

schema.pre('save', function () {
  if (!this.href) {
    this.href = `${process.env.BASE_URL || 'http://localhost:3004'}/tmf-api/documentManagement/v4/document/${this.id}`;
  }
});

module.exports = mongoose.model('TMF667_Document', schema);