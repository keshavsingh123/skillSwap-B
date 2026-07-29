import Joi from "joi";

export const createSkillSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),

  description: Joi.string().trim().min(10).max(2000).required(),

  category: Joi.string().trim().min(2).max(100).required(),

  level: Joi.string().valid("beginner", "intermediate", "advanced").required(),

  mode: Joi.string().valid("online", "offline", "both").required(),

  creditCost: Joi.number().integer().min(1).max(20).default(1),

  durationMinutes: Joi.number().integer().min(15).max(480).default(60),
});

export const updateSkillSchema = createSkillSchema
  .fork(["title", "description", "category", "level", "mode"], (schema) =>
    schema.optional(),
  )
  .min(1);
