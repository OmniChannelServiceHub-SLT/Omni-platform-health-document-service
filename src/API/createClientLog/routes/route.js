const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post(
  '/api/BBVAS/LogAPIFront',
  controller.logAPIFront
);

module.exports = router;