const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const User = require('../models/User');

// Submit a proposal
router.post('/', [auth, [
  check('jobId', 'Job ID is required').not().isEmpty(),
  check('coverLetter', 'Cover letter is required').not().isEmpty(),
  check('bidAmount', 'Bid amount is required').isNumeric(),
  check('estimatedDuration.value', 'Duration value is required').isNumeric(),
  check('estimatedDuration.unit', 'Duration unit is required').isIn(['hours', 'days', 'weeks', 'months'])
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'freelancer') {
      return res.status(403).json({ msg: 'Only freelancers can submit proposals' });
    }

    const job = await Job.findById(req.body.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ msg: 'This job is no longer accepting proposals' });
    }

    const existingProposal = await Proposal.findOne({
      jobId: req.body.jobId,
      freelancerId: req.user.id
    });

    if (existingProposal) {
      return res.status(400).json({ msg: 'You have already submitted a proposal for this job' });
    }

    const newProposal = new Proposal({
      ...req.body,
      freelancerId: req.user.id
    });

    const proposal = await newProposal.save();

    // Add proposal to job's proposals array
    job.proposals.push(proposal._id);
    await job.save();

    res.json(proposal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get proposals for a job
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Only allow business owner or the proposal owner to view proposals
    if (job.businessId.toString() !== req.user.id && 
        !job.proposals.some(p => p.freelancerId.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const proposals = await Proposal.find({ jobId: req.params.jobId })
      .populate('freelancerId', 'profile.name profile.skills profile.hourlyRate');

    res.json(proposals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get my proposals (for freelancers)
router.get('/my', auth, async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user.id })
      .populate('jobId')
      .sort('-createdAt');
    res.json(proposals);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update proposal status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ msg: 'Proposal not found' });
    }

    const job = await Job.findById(proposal.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Only business owner can accept/reject proposals
    if (job.businessId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    proposal.status = req.body.status;
    await proposal.save();

    if (req.body.status === 'accepted') {
      job.status = 'in-progress';
      job.hiredFreelancer = proposal.freelancerId;
      await job.save();

      // Reject all other proposals
      await Proposal.updateMany(
        { 
          jobId: job._id,
          _id: { $ne: proposal._id }
        },
        { status: 'rejected' }
      );
    }

    res.json(proposal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
