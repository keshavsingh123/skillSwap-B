import mongoose from "mongoose";
import { Booking } from "../model/booking.model.js";

import { Skill } from "../model/skill.model.js";
import { Wallet } from "../model/wallet.model.js";

import { WalletTransaction } from "../model/transaction.model.js";

import { ApiError } from "../utils/ApiError.js";

import { USER_ROLES } from "../constants/roles.js";

export async function createBooking(learnerId, input) {
  const skill = await Skill.findOne({
    _id: input.skillId,
    status: "active",
  });

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  if (skill.owner.toString() === learnerId) {
    throw new ApiError(400, "You cannot book your own skill");
  }

  const scheduledAt = new Date(input.scheduledAt);

  const endAt = new Date(
    scheduledAt.getTime() + skill.durationMinutes * 60 * 1000,
  );

  const conflict = await Booking.findOne({
    teacher: skill.owner,

    status: {
      $in: ["pending", "accepted"],
    },

    scheduledAt: {
      $lt: endAt,
    },

    endAt: {
      $gt: scheduledAt,
    },
  });

  if (conflict) {
    throw new ApiError(
      409,
      "Teacher already has another booking during this time",
    );
  }

  return Booking.create({
    skill: skill._id,
    teacher: skill.owner,
    learner: learnerId,

    scheduledAt,
    endAt,

    durationMinutes: skill.durationMinutes,

    creditCost: skill.creditCost,
  });
}

export async function getMyBookings(userId) {
  return Booking.find({
    $or: [
      {
        teacher: userId,
      },
      {
        learner: userId,
      },
    ],
  })
    .populate("skill", "title category")
    .populate("teacher", "name")
    .populate("learner", "name")
    .sort({
      createdAt: -1,
    });
}

export async function getBooking(bookingId, authenticatedUser) {
  const filter = {
    _id: bookingId,
  };

  if (authenticatedUser.role !== USER_ROLES.ADMIN) {
    filter.$or = [
      {
        teacher: authenticatedUser.id,
      },
      {
        learner: authenticatedUser.id,
      },
    ];
  }

  const booking = await Booking.findOne(filter)
    .populate("skill")
    .populate("teacher", "name email")
    .populate("learner", "name email");

  if (!booking) {
    throw new ApiError(404, "Booking not found or access denied");
  }

  return booking;
}

export async function acceptBooking(bookingId, teacherId) {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,

      teacher: teacherId,

      status: "pending",
    },

    {
      $set: {
        status: "accepted",
      },
    },

    {
      new: true,
    },
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found or cannot be accepted");
  }

  return booking;
}

export async function rejectBooking(bookingId, teacherId) {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,

      teacher: teacherId,

      status: "pending",
    },

    {
      $set: {
        status: "rejected",
      },
    },

    {
      new: true,
    },
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found or cannot be rejected");
  }

  return booking;
}

export async function cancelBooking(bookingId, userId) {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,

      $or: [
        {
          learner: userId,
        },
        {
          teacher: userId,
        },
      ],

      status: {
        $in: ["pending", "accepted"],
      },
    },

    {
      $set: {
        status: "cancelled",
      },
    },

    {
      new: true,
    },
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found or cannot be cancelled");
  }

  return booking;
}
export async function confirmBookingCompletion(bookingId, authenticatedUser) {
  const mongoSession = await mongoose.startSession();

  try {
    await mongoSession.withTransaction(async () => {
      const booking = await Booking.findOne({
        _id: bookingId,
        status: "accepted",
      }).session(mongoSession);

      if (!booking) {
        throw new ApiError(404, "Booking not found or cannot be completed");
      }

      const userId = authenticatedUser.id;

      const isTeacher = booking.teacher.toString() === userId;

      const isLearner = booking.learner.toString() === userId;

      if (!isTeacher && !isLearner) {
        throw new ApiError(404, "Booking not found or access denied");
      }

      /*
         Set completion confirmation.
        */
      if (isTeacher) {
        booking.completionConfirmedByTeacher = true;
      }

      if (isLearner) {
        booking.completionConfirmedByLearner = true;
      }

      /*
         Only settle when BOTH participants
         confirm completion.
        */
      const bothConfirmed =
        booking.completionConfirmedByTeacher &&
        booking.completionConfirmedByLearner;

      if (!bothConfirmed || booking.settledAt) {
        await booking.save({
          session: mongoSession,
        });

        return;
      }

      const learnerWallet = await Wallet.findOne({
        user: booking.learner,
      }).session(mongoSession);

      const teacherWallet = await Wallet.findOne({
        user: booking.teacher,
      }).session(mongoSession);

      if (!learnerWallet || !teacherWallet) {
        throw new ApiError(500, "Wallet configuration is missing");
      }

      if (learnerWallet.balance < booking.creditCost) {
        throw new ApiError(409, "Learner does not have enough credits");
      }

      /*
         Debit learner.
        */
      learnerWallet.balance -= booking.creditCost;

      /*
         Credit teacher.
        */
      teacherWallet.balance += booking.creditCost;

      await learnerWallet.save({
        session: mongoSession,
      });

      await teacherWallet.save({
        session: mongoSession,
      });

      /*
         Ledger entries.
        */
      const learnerTransaction = new WalletTransaction({
        user: booking.learner,

        booking: booking._id,

        type: "debit",

        amount: booking.creditCost,

        reason: "SKILL_SESSION",

        balanceAfterTransaction: learnerWallet.balance,
      });

      const teacherTransaction = new WalletTransaction({
        user: booking.teacher,

        booking: booking._id,

        type: "credit",

        amount: booking.creditCost,

        reason: "SKILL_SESSION",

        balanceAfterTransaction: teacherWallet.balance,
      });

      await learnerTransaction.save({
        session: mongoSession,
      });

      await teacherTransaction.save({
        session: mongoSession,
      });

      booking.status = "completed";

      booking.completedAt = new Date();

      booking.settledAt = new Date();

      await booking.save({
        session: mongoSession,
      });
    });
  } finally {
    await mongoSession.endSession();
  }

  return getBooking(bookingId, authenticatedUser);
}
