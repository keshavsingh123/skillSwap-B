import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Booking",

      default: null,
    },

    type: {
      type: String,

      enum: ["credit", "debit", "bonus", "refund", "adjustment"],

      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      required: true,
    },

    balanceAfterTransaction: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema,
);
