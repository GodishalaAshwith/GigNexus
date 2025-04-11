const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["tech-stack", "role", "location", "language"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["member", "moderator", "admin"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rules: [
      {
        title: String,
        description: String,
      },
    ],
    topics: [
      {
        title: String,
        description: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    discussions: [
      {
        title: String,
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        comments: [
          {
            content: String,
            author: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    events: [
      {
        title: String,
        description: String,
        date: Date,
        type: {
          type: String,
          enum: ["online", "offline", "hybrid"],
        },
        location: String,
        attendees: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    resources: [
      {
        title: String,
        description: String,
        type: {
          type: String,
          enum: ["document", "link", "video", "code"],
        },
        url: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    joinRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    stats: {
      memberCount: {
        type: Number,
        default: 0,
      },
      discussionCount: {
        type: Number,
        default: 0,
      },
      eventCount: {
        type: Number,
        default: 0,
      },
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
communitySchema.index({ name: "text", description: "text" });
communitySchema.index({ type: 1, category: 1 });
communitySchema.index({ "members.user": 1 });

// Update stats when members are added/removed
communitySchema.methods.updateStats = async function () {
  this.stats.memberCount = this.members.length;
  this.stats.discussionCount = this.discussions.length;
  this.stats.eventCount = this.events.length;
  await this.save();
};

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
