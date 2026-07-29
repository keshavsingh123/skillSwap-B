import { Availability } from "../model/availability.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function createAvailability(userId, input) {
  if (input.startTime >= input.endTime) {
    throw new ApiError(400, "End time must be greater than start time");
  }

  /*
   Detect overlapping availability slots.

   Example existing:
   10:00 - 12:00

   New:
   11:00 - 13:00

   → conflict
  */
  const conflict = await Availability.findOne({
    user: userId,
    dayOfWeek: input.dayOfWeek,
    active: true,

    startTime: {
      $lt: input.endTime,
    },

    endTime: {
      $gt: input.startTime,
    },
  });

  if (conflict) {
    throw new ApiError(409, "Availability slot overlaps with an existing slot");
  }

  return Availability.create({
    user: userId,
    ...input,
  });
}

export async function getMyAvailability(userId) {
  return Availability.find({
    user: userId,
    active: true,
  }).sort({
    dayOfWeek: 1,
    startTime: 1,
  });
}

export async function getUserAvailability(userId) {
  return Availability.find({
    user: userId,
    active: true,
  })
    .select("dayOfWeek startTime endTime timezone")
    .sort({
      dayOfWeek: 1,
      startTime: 1,
    });
}

export async function deleteAvailability(availabilityId, userId) {
  const availability = await Availability.findOneAndUpdate(
    {
      _id: availabilityId,
      user: userId,
      active: true,
    },
    {
      $set: {
        active: false,
      },
    },
    {
      new: true,
    },
  );

  if (!availability) {
    throw new ApiError(404, "Availability not found or access denied");
  }

  return availability;
}
