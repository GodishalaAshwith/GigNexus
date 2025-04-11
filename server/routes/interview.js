const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateInterviewQuestions } = require('../controllers/interviewController');

router.post('/generate/:jobId', auth, generateInterviewQuestions);

module.exports = router; 