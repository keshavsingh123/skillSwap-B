import Joi from "joi";

import { USER_ROLES, USER_STATUS } from "../constants/roles.js";

export const changeRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .required(),
});

export const changeStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(USER_STATUS))
    .required(),
});
