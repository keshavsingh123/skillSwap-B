import { asyncHandler } from "../utils/asyncHandler.js";

import * as bookingService from "../service/booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Booking request created",
    data: {
      booking,
    },
  });
});

export const myBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.id);

  res.json({
    success: true,
    data: {
      bookings,
    },
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBooking(
    req.params.bookingId,
    req.user,
  );

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

export const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.acceptBooking(
    req.params.bookingId,
    req.user.id,
  );

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

export const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.rejectBooking(
    req.params.bookingId,
    req.user.id,
  );

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.params.bookingId,
    req.user.id,
  );

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});
export const confirmCompletion = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBookingCompletion(
    req.params.bookingId,
    req.user,
  );

  res.status(200).json({
    success: true,

    message:
      booking.status === "completed"
        ? "Booking completed and credits transferred successfully"
        : "Completion confirmation recorded",

    data: {
      booking,
    },
  });
});
