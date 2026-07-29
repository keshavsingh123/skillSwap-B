import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createSkillSchema,
  updateSkillSchema,
} from "../validators/skill.validation.js";

import {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
} from "../controller/skill.controller.js";

const router = Router();

router.get("/", getSkills);

router.get("/:skillId", getSkill);

router.post("/", authenticate, validate(createSkillSchema), createSkill);

router.patch(
  "/:skillId",
  authenticate,
  validate(updateSkillSchema),
  updateSkill,
);

router.delete("/:skillId", authenticate, deleteSkill);

export default router;
