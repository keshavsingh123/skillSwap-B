import { asyncHandler } from "../utils/asyncHandler.js";

import * as skillService from "../service/skill.service.js";

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Skill created successfully",
    data: {
      skill,
    },
  });
});

export const getSkills = asyncHandler(async (req, res) => {
  const result = await skillService.getSkills(req.query);

  res.json({
    success: true,
    data: result,
  });
});

export const getSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.skillId);

  res.json({
    success: true,
    data: {
      skill,
    },
  });
});

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkill(
    req.params.skillId,
    req.user,
    req.body,
  );

  res.json({
    success: true,
    message: "Skill updated successfully",
    data: {
      skill,
    },
  });
});

export const deleteSkill = asyncHandler(async (req, res) => {
  await skillService.deleteSkill(req.params.skillId, req.user);

  res.json({
    success: true,
    message: "Skill deleted successfully",
  });
});
