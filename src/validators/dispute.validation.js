import Joi from "joi";

export const createDisputeSchema = Joi.object({
  reason: Joi.string()
    .valid(
      "TEACHER_NO_SHOW",
      "LEARNER_NO_SHOW",
      "SESSION_INCOMPLETE",
      "QUALITY_ISSUE",
      "OTHER",
    )
    .required(),

  description: Joi.string().trim().min(10).max(2000).required(),
});

export const resolveDisputeSchema = Joi.object({
  status: Joi.string().valid("resolved", "rejected").required(),

  resolution: Joi.string().trim().min(5).max(2000).required(),
});
