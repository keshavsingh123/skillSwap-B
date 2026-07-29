import { getMyProfile } from "../service/user.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await getMyProfile(req.user.id);

  res.status(200).json({
    success: true,

    data: {
      user,
    },
  });
});
