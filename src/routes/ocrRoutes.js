const express = require('express');
const { getText, getBoundingBoxes } = require('../controllers/ocrController');

const router = express.Router();

// POST /api/get-text route
router.post('/get-text', getText);

// POST /api/get-bboxes route
router.post('/get-bboxes', getBoundingBoxes);

module.exports = router;
