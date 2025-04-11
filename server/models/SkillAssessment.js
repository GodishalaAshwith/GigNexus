const mongoose = require("mongoose");

const skillAssessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      required: true,
    },
    type: {
      type: String,
      enum: ["quiz", "coding", "project", "interview"],
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    questions: [
      {
        type: {
          type: String,
          enum: ["multiple-choice", "coding", "text", "file-upload"],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ],
        correctAnswer: String,
        points: {
          type: Number,
          required: true,
        },
        explanation: String,
        testCases: [
          {
            input: String,
            output: String,
            isHidden: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    passingScore: {
      type: Number,
      required: true,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        answers: [
          {
            questionId: mongoose.Schema.Types.ObjectId,
            answer: String,
            score: Number,
            feedback: String,
          },
        ],
        totalScore: Number,
        passed: Boolean,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        timeTaken: Number, // in minutes
        status: {
          type: String,
          enum: ["in-progress", "completed", "failed"],
          default: "in-progress",
        },
      },
    ],
    stats: {
      totalAttempts: {
        type: Number,
        default: 0,
      },
      passRate: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      averageTime: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
skillAssessmentSchema.index({ skill: 1, level: 1 });
skillAssessmentSchema.index({ type: 1 });
skillAssessmentSchema.index({ "submissions.user": 1 });

// Update assessment stats when a submission is made
skillAssessmentSchema.methods.updateStats = async function (submission) {
  this.stats.totalAttempts += 1;

  const completedSubmissions = this.submissions.filter(
    (s) => s.status === "completed"
  );
  this.stats.passRate =
    (completedSubmissions.filter((s) => s.passed).length /
      completedSubmissions.length) *
    100;

  const totalScore = completedSubmissions.reduce(
    (sum, s) => sum + s.totalScore,
    0
  );
  this.stats.averageScore = totalScore / completedSubmissions.length;

  const totalTime = completedSubmissions.reduce(
    (sum, s) => sum + s.timeTaken,
    0
  );
  this.stats.averageTime = totalTime / completedSubmissions.length;

  await this.save();
};

const SkillAssessment = mongoose.model(
  "SkillAssessment",
  skillAssessmentSchema
);

module.exports = SkillAssessment;
