const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get authenticated user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.profile = {
      ...user.profile,
      ...req.body
    };

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all freelancers
router.get('/freelancers', async (req, res) => {
  try {
    const {
      skills,
      hourlyRateMin,
      hourlyRateMax,
      sort = '-createdAt'
    } = req.query;

    let query = { role: 'freelancer' };

    if (skills) {
      query['profile.skills'] = { $in: skills.split(',') };
    }

    if (hourlyRateMin || hourlyRateMax) {
      query['profile.hourlyRate'] = {};
      if (hourlyRateMin) query['profile.hourlyRate'].$gte = Number(hourlyRateMin);
      if (hourlyRateMax) query['profile.hourlyRate'].$lte = Number(hourlyRateMax);
    }

    const freelancers = await User.find(query)
      .select('-password')
      .sort(sort);

    res.json(freelancers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all businesses
router.get('/businesses', async (req, res) => {
  try {
    const { industry, sort = '-createdAt' } = req.query;

    let query = { role: 'business' };

    if (industry) {
      query['profile.industry'] = industry;
    }

    const businesses = await User.find(query)
      .select('-password')
      .sort(sort);

    res.json(businesses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin routes
// Get all users (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user verification status (admin only)
router.patch('/:id/verify', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (admin.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isVerified = req.body.isVerified;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
