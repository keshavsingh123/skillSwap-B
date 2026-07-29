import { Dispute } from "../model/dispute.model.js";

import { Booking } from "../model/booking.model.js";

import { ApiError } from "../utils/ApiError.js";

export async function createDispute(bookingId, userId, input) {
  const booking = await Booking.findOne({
    _id: bookingId,

    $or: [
      {
        teacher: userId,
      },
      {
        learner: userId,
      },
    ],

    status: {
      $in: ["accepted", "completed"],
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found or dispute cannot be raised");
  }

  const existing = await Dispute.findOne({
    booking: bookingId,
  });

  if (existing) {
    throw new ApiError(409, "A dispute already exists for this booking");
  }

  const dispute = await Dispute.create({
    booking: bookingId,

    raisedBy: userId,

    reason: input.reason,

    description: input.description,
  });

  /*
   If session isn't already completed,
   mark it as disputed.
  */
  if (booking.status !== "completed") {
    booking.status = "disputed";

    await booking.save();
  }

  return dispute;
}

export async function getMyDisputes(userId) {
  return Dispute.find({
    raisedBy: userId,
  })
    .populate("booking")
    .sort({
      createdAt: -1,
    });
}

export async function getAllDisputes({ status, page = 1, limit = 20 }) {
  page = Number(page) || 1;
  limit = Number(limit) || 20;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const [disputes, total] = await Promise.all([
    Dispute.find(filter)
      .populate("raisedBy", "name email")
      .populate("booking")
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit),

    Dispute.countDocuments(filter),
  ]);

  return {
    disputes,

    pagination: {
      page,
      limit,
      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function resolveDispute(disputeId, resolvedBy, input) {
  const dispute = await Dispute.findOneAndUpdate(
    {
      _id: disputeId,

      status: {
        $in: ["open", "under_review"],
      },
    },

    {
      $set: {
        status: input.status,

        resolution: input.resolution,

        resolvedBy,
      },
    },

    {
      new: true,
    },
  );

  if (!dispute) {
    throw new ApiError(404, "Dispute not found or already resolved");
  }

  return dispute;
}
