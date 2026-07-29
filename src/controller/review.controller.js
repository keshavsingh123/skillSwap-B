import { asyncHandler } from "../utils/asyncHandler.js";

import * as reviewService from "../service/review.service.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(
    req.params.bookingId,
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,

    message: "Review submitted successfully",

    data: {
      review,
    },
  });
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getUserReviews(req.params.userId);

  res.status(200).json({
    success: true,

    data: {
      reviews,
    },
  });
});
