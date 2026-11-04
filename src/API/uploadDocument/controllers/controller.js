const service = require('../services/service');

// ────────────────────────────────────────────────────────────────────
// SLT-custom upload — legacy envelope, no TMF claim on the response.
// Returns the new document reference in dataBundle.
// ────────────────────────────────────────────────────────────────────

exports.uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        isSuccess: false,
        errorMessege: 'No file provided under field "file"',
        exceptionDetail: null,
        dataBundle: null,
        errorShow: null,
        errorCode: 'MISSING_FILE'
      });
    }

    const doc = await service.persistUpload({ file: req.file, body: req.body });

    return res.status(200).json({
      isSuccess: true,
      errorMessege: null,
      exceptionDetail: null,
      dataBundle: {
        documentId: doc.id,
        href: doc.href
      },
      errorShow: null,
      errorCode: null
    });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────
// TMF667 Document CRUD — CTK-testable.
// ────────────────────────────────────────────────────────────────────

function toDocumentResource(doc) {
  return {
    id: doc.id,
    href: doc.href,
    '@type': doc['@type'] || 'Document',
    '@baseType': doc['@baseType'] || 'Document',
    '@schemaLocation': doc['@schemaLocation'] || null,
    name: doc.name,
    description: doc.description,
    documentType: doc.documentType,
    attachment: doc.attachment || null,
    documentCharacteristic: doc.documentCharacteristic || [],
    relatedObject: doc.relatedObject || null,
    relatedParty: doc.relatedParty || []
  };
}

exports.listDocuments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query['documentType']) filter.documentType = req.query['documentType'];
    if (req.query['name']) filter.name = req.query['name'];

    const docs = await service.listDocuments(filter);
    return res.status(200).json(docs.map(toDocumentResource));
  } catch (err) {
    next(err);
  }
};

exports.getDocumentById = async (req, res, next) => {
  try {
    const doc = await service.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Document not found',
        message: `Document with id ${req.params.id} not found`,
        status: 404
      });
    }
    return res.status(200).json(toDocumentResource(doc));
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await service.deleteDocument(req.params.id);
    if (!doc) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Document not found',
        message: `Document with id ${req.params.id} not found`,
        status: 404
      });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};