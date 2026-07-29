function getRefreshTokenMaxAge() {
  const days = Number(process.env.REFRESH_TOKEN_DAYS) || 30;

  return days * 24 * 60 * 60 * 1000;
}

export function getRefreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,

    secure: isProduction,

    sameSite: isProduction ? "none" : "lax",

    maxAge: getRefreshTokenMaxAge(),

    path: "/api/v1/auth",
  };
}

export function getClearCookieOptions() {
  const options = getRefreshCookieOptions();

  delete options.maxAge;

  return options;
}
