import { asyncHandler } from "../utils/asyncHandler.js";

import * as adminService from "../service/admin.service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getUsers(req.query);

  res.status(200).json({
    success: true,

    data: {
      users,
    },
  });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.changeUserRole(
    req.params.userId,
    req.body.role,
  );

  res.status(200).json({
    success: true,

    message: "User role updated successfully",

    data: {
      user,
    },
  });
});

export const changeUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.changeUserStatus(
    req.params.userId,
    req.body.status,
  );

  res.status(200).json({
    success: true,

    message: "User status updated successfully",

    data: {
      user,
    },
  });
});
