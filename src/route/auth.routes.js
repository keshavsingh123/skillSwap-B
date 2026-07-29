import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
} from "../controller/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { registerSchema, loginSchema } from "../validators/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.post("/logout-all", authenticate, logoutAll);

export default router;
