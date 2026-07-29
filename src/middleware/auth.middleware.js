import { ApiError } from "../utils/ApiError.js";

import { verifyAccessToken } from "../utils/token.js";

import { getUserForAuthentication } from "../service/user.service.js";

export async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    const accessToken = authorization.substring(7);

    const payload = verifyAccessToken(accessToken);

    const user = await getUserForAuthentication(payload.sub);

    if (!user) {
      throw new ApiError(401, "User account is not active");
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new ApiError(401, "Session is no longer valid");
    }

    req.user = {
      id: user._id.toString(),

      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new ApiError(401, "Invalid or expired access token"));
    }

    next(error);
  }
}
