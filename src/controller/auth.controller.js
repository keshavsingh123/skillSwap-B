import mongoose from "mongoose";
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  logoutAllUserSessions,
} from "../service/auth.service.js";

import {
  getRefreshCookieOptions,
  getClearCookieOptions,
} from "../utils/cookie.js";

import { asyncHandler } from "../utils/asyncHandler.js";

function getSessionMetadata(req) {
  return {
    userAgent: req.get("user-agent"),

    ipAddress: req.ip,
  };
}

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, getSessionMetadata(req));

  res.cookie(
    "refreshToken",

    result.refreshToken,

    getRefreshCookieOptions(),
  );

  res.status(201).json({
    success: true,

    message: "User registered successfully",

    data: {
      user: result.user,

      accessToken: result.accessToken,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, getSessionMetadata(req));

  res.cookie(
    "refreshToken",

    result.refreshToken,

    getRefreshCookieOptions(),
  );

  res.status(200).json({
    success: true,

    message: "Login successful",

    data: {
      user: result.user,

      accessToken: result.accessToken,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const result = await refreshUserSession(
    refreshToken,
    getSessionMetadata(req),
  );

  res.cookie(
    "refreshToken",

    result.refreshToken,

    getRefreshCookieOptions(),
  );

  res.status(200).json({
    success: true,

    message: "Access token refreshed successfully",

    data: {
      accessToken: result.accessToken,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await logoutUser(refreshToken);

  res.clearCookie("refreshToken", getClearCookieOptions());

  res.status(200).json({
    success: true,

    message: "Logged out successfully",
  });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await logoutAllUserSessions(req.user.id);

  res.clearCookie("refreshToken", getClearCookieOptions());

  res.status(200).json({
    success: true,

    message: "Logged out from all devices successfully",
  });
});
