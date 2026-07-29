import { User } from "../model/user.model.js";
import { USER_STATUS } from "../constants/roles.js";
import { ApiError } from "../utils/ApiError.js";

export async function getUserForAuthentication(userId) {
  const user = await User.findOne({
    _id: userId,
    status: USER_STATUS.ACTIVE,
  });

  return user;
}

export async function getMyProfile(userId) {
  const user = await User.findOne({
    _id: userId,
    status: {
      $ne: USER_STATUS.DELETED,
    },
  }).select("name email role status createdAt updatedAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
