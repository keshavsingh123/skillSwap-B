import { Review } from "../model/review.model.js";

import { Booking } from "../model/booking.model.js";

import { ApiError } from "../utils/ApiError.js";

export async function createReview(bookingId, userId, input) {
  const booking = await Booking.findOne({
    _id: bookingId,

    status: "completed",

    $or: [
      {
        teacher: userId,
      },
      {
        learner: userId,
      },
    ],
  });

  if (!booking) {
    throw new ApiError(404, "Completed booking not found");
  }

  const reviewedUser =
    booking.teacher.toString() === userId ? booking.learner : booking.teacher;

  const existing = await Review.findOne({
    booking: bookingId,

    reviewer: userId,
  });

  if (existing) {
    throw new ApiError(409, "You have already reviewed this booking");
  }

  return Review.create({
    booking: bookingId,

    reviewer: userId,

    reviewedUser,

    rating: input.rating,

    comment: input.comment,
  });
}

export async function getUserReviews(userId) {
  return Review.find({
    reviewedUser: userId,
  })
    .populate("reviewer", "name")
    .sort({
      createdAt: -1,
    });
}
