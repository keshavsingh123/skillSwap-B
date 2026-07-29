import { asyncHandler } from "../utils/asyncHandler.js";

import * as disputeService from "../service/dispute.service.js";

export const createDispute = asyncHandler(async (req, res) => {
  const dispute = await disputeService.createDispute(
    req.params.bookingId,
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,

    message: "Dispute raised successfully",

    data: {
      dispute,
    },
  });
});

export const myDisputes = asyncHandler(async (req, res) => {
  const disputes = await disputeService.getMyDisputes(req.user.id);

  res.status(200).json({
    success: true,

    data: {
      disputes,
    },
  });
});

export const allDisputes = asyncHandler(async (req, res) => {
  const result = await disputeService.getAllDisputes(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await disputeService.resolveDispute(
    req.params.disputeId,
    req.user.id,
    req.body,
  );

  res.status(200).json({
    success: true,

    message: "Dispute resolved successfully",

    data: {
      dispute,
    },
  });
});
