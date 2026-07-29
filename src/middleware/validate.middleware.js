import { ApiError } from "../utils/ApiError.js";

export function validate(schema) {
  return function validationMiddleware(req, res, next) {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const details = error.details.map((item) => ({
        field: item.path.join("."),
        message: item.message.replace(/"/g, ""),
      }));

      return next(new ApiError(400, "Validation failed", details));
    }

    /*
     Use Joi's sanitized value.

     stripUnknown removes fields that
     are not defined in our schema.
    */
    req.body = value;

    next();
  };
}
