import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import { Session } from "../model/session.model.js";

import { USER_ROLES, USER_STATUS } from "../constants/roles.js";

import { ApiError } from "../utils/ApiError.js";

import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
} from "../utils/token.js";
import { sendWelcomeEmail, sendLoginAlertEmail } from "./email.service.js";
import { createUserWallet } from "./wallet.service.js";
import { sendEmailSafe } from "../utils/sendEmailSafe.js";

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

// async function createUserSession(user, sessionMetadata = {}) {
//   const refreshToken = createRefreshToken();

//   const tokenHash = hashRefreshToken(refreshToken);

//   const session = await Session.create({
//     user: user._id,

//     tokenHash,

//     expiresAt: getRefreshTokenExpiry(),

//     userAgent: sessionMetadata.userAgent || null,

//     ipAddress: sessionMetadata.ipAddress || null,
//   });

//   const accessToken = createAccessToken(user);

//   return {
//     accessToken,
//     refreshToken,
//     session,
//   };
// }
async function createUserSession(
  user,
  sessionMetadata = {},
  mongoSession = null,
) {
  const refreshToken = createRefreshToken();

  const tokenHash = hashRefreshToken(refreshToken);

  const session = new Session({
    user: user._id,

    tokenHash,

    expiresAt: getRefreshTokenExpiry(),

    userAgent: sessionMetadata.userAgent || null,

    ipAddress: sessionMetadata.ipAddress || null,
  });

  await session.save({
    session: mongoSession,
  });

  const accessToken = createAccessToken(user);

  return {
    accessToken,
    refreshToken,
    session,
  };
}

export async function registerUser(input, sessionMetadata) {
  const email = normalizeEmail(input.email);

  const mongoSession = await mongoose.startSession();

  let user;
  let tokens;

  try {
    await mongoSession.withTransaction(async () => {
      const existingUser = await User.findOne({
        email,
      })
        .select("_id")
        .session(mongoSession);

      if (existingUser) {
        throw new ApiError(409, "An account with this email already exists");
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      user = new User({
        name: input.name.trim(),

        email,

        passwordHash,

        role: USER_ROLES.USER,

        status: USER_STATUS.ACTIVE,
      });

      await user.save({
        session: mongoSession,
      });

      /*
         Create initial wallet
         + 3 welcome credits.
        */
      await createUserWallet(user._id, mongoSession);

      /*
         Create refresh session.
        */
      tokens = await createUserSession(user, sessionMetadata, mongoSession);
    });
  } finally {
    await mongoSession.endSession();
  }

  /*
   Do NOT send email inside DB transaction.
   External services cannot participate
   in MongoDB rollback.
  */
  await sendEmailSafe(
    sendWelcomeEmail({
      email: user.email,

      name: user.name,
    }),
  );

  return {
    user: sanitizeUser(user),

    accessToken: tokens.accessToken,

    refreshToken: tokens.refreshToken,
  };
}

export async function loginUser(input, sessionMetadata) {
  const email = normalizeEmail(input.email);

  if (!email || !input.password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    email,
  }).select("+passwordHash");

  /*
   Use the same error for:
   - invalid email
   - invalid password

   This prevents email enumeration.
  */
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status === USER_STATUS.BLOCKED) {
    throw new ApiError(403, "Your account has been blocked");
  }

  if (user.status === USER_STATUS.DELETED) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = await createUserSession(user, sessionMetadata);
  await sendEmailSafe(
    sendLoginAlertEmail({
      user,
      sessionMetadata,
    }),
  );
  return {
    user: sanitizeUser(user),

    accessToken: tokens.accessToken,

    refreshToken: tokens.refreshToken,
  };
}

export async function refreshUserSession(refreshToken, sessionMetadata) {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  /*
   findOneAndUpdate makes consuming
   the old token atomic.

   Once used, the old refresh token
   is immediately revoked.
  */
  const oldSession = await Session.findOneAndUpdate(
    {
      tokenHash,

      revokedAt: null,

      expiresAt: {
        $gt: new Date(),
      },
    },

    {
      $set: {
        revokedAt: new Date(),
      },
    },

    {
      new: true,
    },
  ).populate("user");

  if (!oldSession || !oldSession.user) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = oldSession.user;

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(401, "User account is not active");
  }

  const newTokens = await createUserSession(user, sessionMetadata);

  oldSession.replacedBySession = newTokens.session._id;

  await oldSession.save();

  return {
    user: sanitizeUser(user),

    accessToken: newTokens.accessToken,

    refreshToken: newTokens.refreshToken,
  };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashRefreshToken(refreshToken);

  await Session.updateOne(
    {
      tokenHash,
      revokedAt: null,
    },

    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
}

export async function logoutAllUserSessions(userId) {
  await Session.updateMany(
    {
      user: userId,

      revokedAt: null,
    },

    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );

  await User.updateOne(
    {
      _id: userId,
    },

    {
      $inc: {
        tokenVersion: 1,
      },
    },
  );
}
