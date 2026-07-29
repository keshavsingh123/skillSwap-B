import { asyncHandler } from "../utils/asyncHandler.js";

import { getWallet, getTransactions } from "../service/wallet.service.js";

export const myWallet = asyncHandler(async (req, res) => {
  const wallet = await getWallet(req.user.id);

  res.json({
    success: true,
    data: {
      wallet,
    },
  });
});

export const myTransactions = asyncHandler(async (req, res) => {
  const transactions = await getTransactions(
    req.user.id,
    req.query.page,
    req.query.limit,
  );

  res.json({
    success: true,
    data: {
      transactions,
    },
  });
});
