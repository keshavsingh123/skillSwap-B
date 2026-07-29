import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Booking",

      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

reviewSchema.index(
  {
    booking: 1,
    reviewer: 1,
  },
  {
    unique: true,
  },
);

export const Review = mongoose.model("Review", reviewSchema);
