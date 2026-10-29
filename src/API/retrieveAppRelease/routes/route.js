const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post(
  '/api/AccountOMNI/CheckAppUpdateRequest',
  controller.checkAppUpdate
);

module.exports = router;