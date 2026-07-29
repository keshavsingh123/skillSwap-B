import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Booking",

      required: true,

      unique: true,
    },

    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    reason: {
      type: String,

      enum: [
        "TEACHER_NO_SHOW",
        "LEARNER_NO_SHOW",
        "SESSION_INCOMPLETE",
        "QUALITY_ISSUE",
        "OTHER",
      ],

      required: true,
    },

    description: {
      type: String,
      maxlength: 2000,
    },

    status: {
      type: String,

      enum: ["open", "under_review", "resolved", "rejected"],

      default: "open",
    },

    resolution: {
      type: String,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Dispute = mongoose.model("Dispute", disputeSchema);
