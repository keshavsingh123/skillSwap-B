import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { createAvailabilitySchema } from "../validators/availability.validation.js";

import {
  createAvailability,
  getMyAvailability,
  getUserAvailability,
  deleteAvailability,
} from "../controller/availability.controller.js";

const router = Router();

router.get("/users/:userId", getUserAvailability);

router.use(authenticate);

router.get("/me", getMyAvailability);

router.post("/", validate(createAvailabilitySchema), createAvailability);

router.delete("/:availabilityId", deleteAvailability);

export default router;
