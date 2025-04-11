const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { jobId, amount } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    if (job.businessId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        jobId: jobId,
        businessId: req.user.id,
        freelancerId: job.hiredFreelancer.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { jobId } = paymentIntent.metadata;

    try {
      const job = await Job.findById(jobId);
      if (job) {
        job.status = 'completed';
        await job.save();
      }
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  }

  res.json({ received: true });
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let paymentIntents;
    if (user.role === 'business') {
      paymentIntents = await stripe.paymentIntents.list({
        metadata: { businessId: req.user.id }
      });
    } else if (user.role === 'freelancer') {
      paymentIntents = await stripe.paymentIntents.list({
        metadata: { freelancerId: req.user.id }
      });
    }

    res.json(paymentIntents.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
