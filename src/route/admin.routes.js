import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { USER_ROLES } from "../constants/roles.js";

import {
  changeRoleSchema,
  changeStatusSchema,
} from "../validators/admin.validation.js";

import {
  getUsers,
  changeUserRole,
  changeUserStatus,
} from "../controller/admin.controller.js";

const router = Router();

router.use(authenticate, authorizeRoles(USER_ROLES.ADMIN));

router.get("/users", getUsers);

router.patch("/users/:userId/role", validate(changeRoleSchema), changeUserRole);

router.patch(
  "/users/:userId/status",
  validate(changeStatusSchema),
  changeUserStatus,
);

export default router;
