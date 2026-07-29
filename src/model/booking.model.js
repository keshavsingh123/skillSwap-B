import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Skill",

      required: true,
      index: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
      index: true,
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
      index: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
    },

    creditCost: {
      type: Number,
      required: true,
    },

    status: {
      type: String,

      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
        "disputed",
      ],

      default: "pending",

      index: true,
    },

    completionConfirmedByTeacher: {
      type: Boolean,
      default: false,
    },

    completionConfirmedByLearner: {
      type: Boolean,
      default: false,
    },
    endAt: {
      type: Date,
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    settledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({
  teacher: 1,
  scheduledAt: 1,
});

export const Booking = mongoose.model("Booking", bookingSchema);
