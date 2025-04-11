const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "code", "contract", "proposal"],
      default: "text",
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    relatedTo: {
      type: {
        type: String,
        enum: ["job", "contract", "proposal", "community", "assessment", null],
        default: null,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "relatedTo.type",
      },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    readAt: {
      type: Date,
    },
    metadata: {
      isEncrypted: {
        type: Boolean,
        default: false,
      },
      encryptionKey: String,
      ipAddress: String,
      userAgent: String,
    },
    reactions: [
      {
        type: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
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
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ "relatedTo.type": 1, "relatedTo.id": 1 });
messageSchema.index({ threadId: 1 });
messageSchema.index({ createdAt: -1 });

// Mark message as read
messageSchema.methods.markAsRead = async function () {
  this.status = "read";
  this.readAt = new Date();
  await this.save();
};

// Add reaction to message
messageSchema.methods.addReaction = async function (userId, reactionType) {
  const existingReaction = this.reactions.find(
    (r) => r.user.toString() === userId.toString()
  );

  if (existingReaction) {
    existingReaction.type = reactionType;
  } else {
    this.reactions.push({ type: reactionType, user: userId });
  }

  await this.save();
};

// Remove reaction from message
messageSchema.methods.removeReaction = async function (userId) {
  this.reactions = this.reactions.filter(
    (r) => r.user.toString() !== userId.toString()
  );
  await this.save();
};

// Soft delete message
messageSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  await this.save();
};

// Edit message
messageSchema.methods.edit = async function (newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  await this.save();
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
