// src/api/versionRoutes.js

const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

router.get('/', versionController.getVersion);
router.post('/', versionController.updateVersion);

module.exports = router;
