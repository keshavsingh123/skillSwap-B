import Joi from "joi";

export const createBookingSchema = Joi.object({
  skillId: Joi.string().hex().length(24).required(),

  scheduledAt: Joi.date().iso().greater("now").required(),
});
