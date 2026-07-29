import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { createReviewSchema } from "../validators/review.validation.js";

import {
  createReview,
  getUserReviews,
} from "../controller/review.controller.js";

const router = Router();

router.get("/users/:userId", getUserReviews);

router.post(
  "/bookings/:bookingId",
  authenticate,
  validate(createReviewSchema),
  createReview,
);

export default router;
