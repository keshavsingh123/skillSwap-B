import { asyncHandler } from "../utils/asyncHandler.js";

import * as availabilityService from "../service/availability.service.js";

export const createAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.createAvailability(
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Availability created successfully",
    data: {
      availability,
    },
  });
});

export const getMyAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.getMyAvailability(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      availability,
    },
  });
});

export const getUserAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.getUserAvailability(
    req.params.userId,
  );

  res.status(200).json({
    success: true,
    data: {
      availability,
    },
  });
});

export const deleteAvailability = asyncHandler(async (req, res) => {
  await availabilityService.deleteAvailability(
    req.params.availabilityId,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: "Availability removed successfully",
  });
});
