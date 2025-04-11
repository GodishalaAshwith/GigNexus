const path = require('path');
const fs = require('fs'); // added this line
const { extractTextFromCV, generateCoverLetter } = require('../services/geminiService');
const Job = require('../models/Job'); 
const mongoose = require('mongoose');

async function handleCoverLetterRequest(req, res) {
  const jobId = req.body.jobId;
  const file = req.file;

  if (!file || !jobId) {
    return res.status(400).json({ message: 'Missing file or jobId' });
  }

  // Validate jobId format
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  try {
    const cvText = await extractTextFromCV(path.resolve(file.path));

    const job = await Job.findById(jobId).populate('businessId');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const jobData = {
      title: job.title,
      company: job.businessId?.name || 'Unknown Company',
      description: job.description,
      skills: job.skills,
    };

    const coverLetter = await generateCoverLetter(cvText, jobData);
    res.json({ coverLetter });
  } catch (err) {
    console.error('Cover Letter Generation Error:', err);
    const statusCode = err.message.includes('not configured') ? 500 : 
                      err.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ 
      message: err.message || 'Failed to generate cover letter'
    });
  } finally {
    // Clean up uploaded file
    try {
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
    } catch (cleanupError) {
      console.error('File cleanup error:', cleanupError);
    }
  }
}

module.exports = { handleCoverLetterRequest };
