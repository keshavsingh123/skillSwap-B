import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      unique: true,

      index: true,
    },

    balance: {
      type: Number,
      default: 3,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Wallet = mongoose.model("Wallet", walletSchema);
