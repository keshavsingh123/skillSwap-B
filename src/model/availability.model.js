import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

availabilitySchema.index({
  user: 1,
  dayOfWeek: 1,
  startTime: 1,
});

export const Availability = mongoose.model("Availability", availabilitySchema);
