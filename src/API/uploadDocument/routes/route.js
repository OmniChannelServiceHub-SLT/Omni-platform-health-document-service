const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/controller');

// In-memory storage so the service controls where files land.
// 10 MB per-file cap; adjust once real limits are known.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// SLT-custom upload — legacy envelope
router.post(
  '/api/NewCon/UploadMultipartSingle',
  upload.single('file'),
  controller.uploadSingle
);

// TMF667 Document CRUD — CTK-tested
router.get(
  '/tmf-api/documentManagement/v4/document',
  controller.listDocuments
);

router.get(
  '/tmf-api/documentManagement/v4/document/:id',
  controller.getDocumentById
);

router.delete(
  '/tmf-api/documentManagement/v4/document/:id',
  controller.deleteDocument
);

module.exports = router;