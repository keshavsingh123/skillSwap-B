import Joi from "joi";

const emailSchema = Joi.string().trim().lowercase().email().max(254);

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[a-z]/)
  .pattern(/[A-Z]/)
  .pattern(/[0-9]/)
  .pattern(/[^a-zA-Z0-9]/);

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must contain at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
  }),

  email: emailSchema.required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),

  password: passwordSchema.required().messages({
    "string.empty": "Password is required",

    "string.min": "Password must contain at least 8 characters",

    "string.max": "Password cannot exceed 128 characters",

    "string.pattern.base":
      "Password must contain uppercase, lowercase, number and special character",
  }),
});

export const loginSchema = Joi.object({
  email: emailSchema.required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
