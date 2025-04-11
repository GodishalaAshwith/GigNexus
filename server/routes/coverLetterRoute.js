const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { handleCoverLetterRequest } = require('../controllers/coverLetterController');

router.post('/upload', upload.single('cv'), handleCoverLetterRequest);

module.exports = router;
