import { User } from "../model/user.model.js";

import { ApiError } from "../utils/ApiError.js";

import { USER_ROLES, USER_STATUS } from "../constants/roles.js";

export async function getUsers({ page = 1, limit = 20 }) {
  const users = await User.find({
    status: {
      $ne: USER_STATUS.DELETED,
    },
  })
    .select("name email role status createdAt")
    .sort({
      createdAt: -1,
    })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return users;
}

export async function changeUserRole(userId, role) {
  if (!Object.values(USER_ROLES).includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    userId,

    {
      $set: {
        role,
      },
    },

    {
      new: true,
    },
  ).select("name email role status");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

export async function changeUserStatus(userId, status) {
  if (!Object.values(USER_STATUS).includes(status)) {
    throw new ApiError(400, "Invalid user status");
  }

  const user = await User.findByIdAndUpdate(
    userId,

    {
      $set: {
        status,
      },

      $inc: {
        tokenVersion: 1,
      },
    },

    {
      new: true,
    },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
