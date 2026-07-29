import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { createBookingSchema } from "../validators/booking.validation.js";

import {
  createBooking,
  myBookings,
  getBooking,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  confirmCompletion,
} from "../controller/booking.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createBookingSchema), createBooking);

router.get("/my", myBookings);

router.get("/:bookingId", getBooking);

router.patch("/:bookingId/accept", acceptBooking);

router.patch("/:bookingId/reject", rejectBooking);

router.patch("/:bookingId/cancel", cancelBooking);
router.patch("/:bookingId/confirm-completion", confirmCompletion);
export default router;
