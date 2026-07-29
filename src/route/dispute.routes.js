import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { USER_ROLES } from "../constants/roles.js";

import {
  createDisputeSchema,
  resolveDisputeSchema,
} from "../validators/dispute.validation.js";

import {
  createDispute,
  myDisputes,
  allDisputes,
  resolveDispute,
} from "../controller/dispute.controller.js";

const router = Router();

router.use(authenticate);

router.post(
  "/bookings/:bookingId",
  validate(createDisputeSchema),
  createDispute,
);

router.get("/my", myDisputes);

router.get(
  "/",
  authorizeRoles(USER_ROLES.MODERATOR, USER_ROLES.ADMIN),
  allDisputes,
);

router.patch(
  "/:disputeId/resolve",
  authorizeRoles(USER_ROLES.MODERATOR, USER_ROLES.ADMIN),
  validate(resolveDisputeSchema),
  resolveDispute,
);

export default router;
