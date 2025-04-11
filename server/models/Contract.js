const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "active",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "draft",
    },
    terms: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      paymentTerms: {
        type: String,
        enum: ["hourly", "fixed", "milestone"],
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      milestones: [
        {
          description: String,
          amount: Number,
          deadline: Date,
          status: {
            type: String,
            enum: ["pending", "in-progress", "completed", "approved"],
            default: "pending",
          },
        },
      ],
    },
    deliverables: [
      {
        description: String,
        deadline: Date,
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed", "approved"],
          default: "pending",
        },
      },
    ],
    intellectualProperty: {
      type: String,
      required: true,
    },
    confidentiality: {
      type: Boolean,
      default: true,
    },
    nonCompete: {
      type: Boolean,
      default: false,
    },
    disputeHistory: [
      {
        issue: String,
        description: String,
        status: {
          type: String,
          enum: ["open", "resolved", "closed"],
          default: "open",
        },
        resolution: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        resolvedAt: Date,
      },
    ],
    payments: [
      {
        amount: Number,
        status: {
          type: String,
          enum: ["pending", "processing", "completed", "failed"],
          default: "pending",
        },
        method: String,
        transactionId: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
contractSchema.index({ freelancer: 1, status: 1 });
contractSchema.index({ business: 1, status: 1 });
contractSchema.index({ job: 1 });

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
