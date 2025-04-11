const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    type: {
      type: String,
      enum: ["milestone", "hourly", "fixed", "refund", "dispute"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "disputed",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "bank_transfer"],
      required: true,
    },
    paymentDetails: {
      transactionId: String,
      paymentIntentId: String,
      paymentMethodId: String,
      last4: String,
      brand: String,
    },
    description: String,
    metadata: {
      milestoneId: mongoose.Schema.Types.ObjectId,
      hoursWorked: Number,
      periodStart: Date,
      periodEnd: Date,
      invoiceNumber: String,
    },
    platformFee: {
      amount: Number,
      percentage: Number,
    },
    tax: {
      amount: Number,
      rate: Number,
      country: String,
    },
    refundDetails: {
      reason: String,
      amount: Number,
      processedAt: Date,
      transactionId: String,
    },
    disputeDetails: {
      reason: String,
      description: String,
      status: {
        type: String,
        enum: ["open", "under_review", "resolved", "closed"],
        default: "open",
      },
      resolution: String,
      evidence: [
        {
          type: String,
          url: String,
          description: String,
        },
      ],
    },
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
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
paymentSchema.index({ contract: 1 });
paymentSchema.index({ payer: 1, status: 1 });
paymentSchema.index({ payee: 1, status: 1 });
paymentSchema.index({ "paymentDetails.transactionId": 1 });

// Calculate total amount including fees and tax
paymentSchema.methods.calculateTotal = function () {
  return this.amount + this.platformFee.amount + this.tax.amount;
};

// Update payment status
paymentSchema.methods.updateStatus = async function (newStatus, note) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    note: note,
  });
  await this.save();
};

// Process refund
paymentSchema.methods.processRefund = async function (amount, reason) {
  this.status = "refunded";
  this.refundDetails = {
    reason,
    amount,
    processedAt: new Date(),
  };
  this.timeline.push({
    status: "refunded",
    note: `Refund processed: ${reason}`,
  });
  await this.save();
};

// Open dispute
paymentSchema.methods.openDispute = async function (reason, description) {
  this.status = "disputed";
  this.disputeDetails = {
    reason,
    description,
    status: "open",
  };
  this.timeline.push({
    status: "disputed",
    note: `Dispute opened: ${reason}`,
  });
  await this.save();
};

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
