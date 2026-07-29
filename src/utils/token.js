import crypto from "crypto";
import jwt from "jsonwebtoken";

function getAccessTokenSecret() {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }

  return secret;
}

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    getAccessTokenSecret(),
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
      issuer: "skillswap-api",
      audience: "skillswap-client",
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getAccessTokenSecret(), {
    issuer: "skillswap-api",
    audience: "skillswap-client",
  });
}

export function createRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiry() {
  const days = Number(process.env.REFRESH_TOKEN_DAYS) || 30;

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
