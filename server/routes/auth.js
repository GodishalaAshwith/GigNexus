const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');
require('../config/passport');

// Register
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be either freelancer or business').isIn(['freelancer', 'business'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, role, profile } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password,
      role,
      profile: profile || {}
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if user has a password (might be OAuth user)
    if (!user.password) {
      console.log('User has no password (OAuth user):', email);
      return res.status(400).json({ msg: 'Please use OAuth login for this account' });
    }

    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Password mismatch for:', email);
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) {
            console.error('JWT sign error:', err);
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (pwError) {
      console.error('Password comparison error:', pwError);
      res.status(500).json({ msg: 'Authentication error' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

// Only add GitHub OAuth routes if credentials are configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  // GitHub OAuth
  router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );

  router.get('/github/callback',
    passport.authenticate('github', { session: false }),
    (req, res) => {
      const token = jwt.sign(
        { user: { id: req.user.id, role: req.user.role } },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
  );
}

// Only add LinkedIn OAuth routes if credentials are configured
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  // LinkedIn OAuth
  router.get('/linkedin',
    passport.authenticate('linkedin', { state: true })
  );

  router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false }),
    (req, res) => {
      const token = jwt.sign(
        { user: { id: req.user.id, role: req.user.role } },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
  );
}

module.exports = router;
