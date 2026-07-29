import Joi from "joi";

const timeSchema = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required();

export const createAvailabilitySchema = Joi.object({
  dayOfWeek: Joi.number().integer().min(0).max(6).required(),

  startTime: timeSchema,

  endTime: timeSchema,

  timezone: Joi.string().trim().max(100).default("Asia/Kolkata"),
});
