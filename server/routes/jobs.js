const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

// Create a job
router.post('/', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('skills', 'Skills are required').isArray().not().isEmpty(),
  check('budget.type', 'Budget type is required').isIn(['fixed', 'hourly']),
  check('budget.min', 'Minimum budget is required').isNumeric(),
  check('budget.max', 'Maximum budget is required').isNumeric()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'business') {
      return res.status(403).json({ msg: 'Only businesses can post jobs' });
    }

    const newJob = new Job({
      ...req.body,
      businessId: req.user.id
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      skills,
      budgetMin,
      budgetMax,
      status = 'open',
      sort = '-createdAt'
    } = req.query;

    let query = { status };

    if (search) {
      query.$text = { $search: search };
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (budgetMin || budgetMax) {
      query.budget = {};
      if (budgetMin) query.budget.$gte = Number(budgetMin);
      if (budgetMax) query.budget.$lte = Number(budgetMax);
    }

    const jobs = await Job.find(query)
      .sort(sort)
      .populate('businessId', 'profile.companyName')
      .populate('proposals', 'freelancerId status');

    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('businessId', 'profile.companyName')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancerId',
          select: 'profile.name profile.skills'
        }
      });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Update job status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    if (job.businessId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    job.status = req.body.status;
    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
