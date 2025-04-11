const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    },
    min: Number,
    max: Number
  },
  deadline: Date,
  isUrgent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  hiredFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text'
});

module.exports = mongoose.model('Job', jobSchema);
