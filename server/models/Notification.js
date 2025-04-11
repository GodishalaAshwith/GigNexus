const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "job_posted",
        "proposal_received",
        "proposal_accepted",
        "proposal_rejected",
        "contract_created",
        "milestone_completed",
        "payment_received",
        "review_received",
        "community_invite",
        "community_join_request",
        "skill_assessment_completed",
        "message_received",
        "system_alert",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
    readAt: {
      type: Date,
    },
    actionUrl: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

// Mark notification as read
notificationSchema.methods.markAsRead = async function () {
  this.status = "read";
  this.readAt = new Date();
  await this.save();
};

// Mark notification as archived
notificationSchema.methods.archive = async function () {
  this.status = "archived";
  await this.save();
};

// Static method to create multiple notifications
notificationSchema.statics.createBulk = async function (notifications) {
  return this.insertMany(notifications);
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { recipient: userId, status: "unread" },
    { $set: { status: "read", readAt: new Date() } }
  );
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
