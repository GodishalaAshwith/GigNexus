const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    value: Number,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one proposal per job per freelancer
proposalSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
