const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate random token
exports.generateRandomToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// Hash token
exports.hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Send email
exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

// Calculate match score between job and freelancer
exports.calculateMatchScore = (job, freelancer) => {
  let score = 0;
  const weights = {
    skills: 0.4,
    experience: 0.3,
    location: 0.2,
    availability: 0.1,
  };

  // Skills match
  const matchingSkills = job.requiredSkills.filter((skill) =>
    freelancer.skills.includes(skill)
  );
  score += (matchingSkills.length / job.requiredSkills.length) * weights.skills;

  // Experience match
  const experienceMatch = freelancer.experience.some((exp) =>
    exp.title.toLowerCase().includes(job.title.toLowerCase())
  );
  score += (experienceMatch ? 1 : 0) * weights.experience;

  // Location match
  if (job.location.type === "remote") {
    score += weights.location;
  } else if (job.location.country === freelancer.location.country) {
    score += weights.location;
  }

  // Availability match
  if (freelancer.availability === job.projectType) {
    score += weights.availability;
  }

  return Math.round(score * 100);
};

// Format currency
exports.formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Calculate time difference
exports.getTimeDifference = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(/[<>]/g, "").trim();
};

// Generate slug
exports.generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// Validate email
exports.isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password strength
exports.validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};
