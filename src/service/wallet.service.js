import { Wallet } from "../model/wallet.model.js";

import { WalletTransaction } from "../model/transaction.model.js";

import { ApiError } from "../utils/ApiError.js";

const WELCOME_CREDITS = 3;

export async function createUserWallet(userId, mongoSession = null) {
  const wallet = new Wallet({
    user: userId,
    balance: WELCOME_CREDITS,
  });

  await wallet.save({
    session: mongoSession,
  });

  const transaction = new WalletTransaction({
    user: userId,

    type: "bonus",

    amount: WELCOME_CREDITS,

    reason: "WELCOME_BONUS",

    balanceAfterTransaction: WELCOME_CREDITS,
  });

  await transaction.save({
    session: mongoSession,
  });

  return wallet;
}

export async function getWallet(userId) {
  const wallet = await Wallet.findOne({
    user: userId,
  });

  if (!wallet) {
    throw new ApiError(404, "Wallet not found");
  }

  return wallet;
}

export async function getTransactions(userId, page = 1, limit = 20) {
  page = Number(page) || 1;
  limit = Number(limit) || 20;

  const filter = {
    user: userId,
  };

  const [transactions, total] = await Promise.all([
    WalletTransaction.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit),

    WalletTransaction.countDocuments(filter),
  ]);

  return {
    transactions,

    pagination: {
      page,
      limit,
      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}
