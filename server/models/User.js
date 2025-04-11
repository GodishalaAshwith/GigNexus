const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.oauthProvider;
    }
  },
  role: {
    type: String,
    enum: ['freelancer', 'business', 'admin'],
    required: true,
  },
  oauthProvider: {
    type: String,
    enum: ['github', 'linkedin', null],
    default: null
  },
  oauthId: String,
  profile: {
    name: String,
    avatar: String,
    location: String,
    bio: String,
    // Freelancer specific
    skills: [String],
    hourlyRate: Number,
    portfolio: [{
      title: String,
      description: String,
      link: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      year: Number
    }],
    // Business specific
    companyName: String,
    industry: String,
    website: String,
    companySize: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
