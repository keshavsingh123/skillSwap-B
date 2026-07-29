import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    mode: {
      type: String,
      enum: ["online", "offline", "both"],
      required: true,
    },

    creditCost: {
      type: Number,
      min: 1,
      default: 1,
    },

    durationMinutes: {
      type: Number,
      min: 15,
      max: 480,
      default: 60,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "removed"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

skillSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

export const Skill = mongoose.model("Skill", skillSchema);
