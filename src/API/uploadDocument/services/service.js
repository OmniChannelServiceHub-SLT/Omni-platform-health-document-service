const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const Document = require('../../../models/TMF667_document');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve('storage/uploads');

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * Stores uploaded file on disk and creates a TMF667 Document record.
 * Returns the persisted Document.
 */
exports.persistUpload = async ({ file, body }) => {
  await ensureUploadDir();

  const id = crypto.randomUUID();
  const ext = path.extname(file.originalname || '');
  const filename = `${id}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(filePath, file.buffer);

  const doc = new Document({
    id,
    name: file.originalname || filename,
    description: body?.description || null,
    documentType: body?.documentType || 'GeneralDocument',
    '@type': 'Document',
    '@baseType': 'Document',
    attachment: {
      attachmentId: id,
      mimeType: file.mimetype,
      size: file.size,
      sizeUnit: 'byte',
      url: `/storage/uploads/${filename}`,
      attachmentRef: body?.attachmentRef || null,
      validFor: {
        startDateTime: new Date().toISOString()
      }
    },
    documentCharacteristic: body?.characteristic
      ? [{ name: 'original', value: body.characteristic }]
      : [],
    relatedObject: body?.relatedObject
      ? { id: body.relatedObject, '@referredType': 'Unknown' }
      : null
  });

  return await doc.save();
};

exports.listDocuments = async (filter = {}) => {
  return await Document.find(filter);
};

exports.getDocumentById = async (id) => {
  return await Document.findOne({ id });
};

exports.deleteDocument = async (id) => {
  const doc = await Document.findOne({ id });
  if (!doc) return null;

  // Best-effort file removal — do not fail the delete if the file is gone
  try {
    const filename = doc.attachment?.url?.split('/').pop();
    if (filename) {
      await fs.unlink(path.join(UPLOAD_DIR, filename));
    }
  } catch {
    // swallow — file may already be gone
  }

  await Document.deleteOne({ id });
  return doc;
};