import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./route/health.routes.js";
import authRoutes from "./route/auth.routes.js";
import userRoutes from "./route/user.routes.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import skillRoutes from "./route/skill.routes.js";

import bookingRoutes from "./route/booking.routes.js";
import availabilityRoutes from "./route/availability.routes.js";

import walletRoutes from "./route/wallet.routes.js";

import reviewRoutes from "./route/review.routes.js";

import disputeRoutes from "./route/dispute.routes.js";

import adminRoutes from "./route/admin.routes.js";
const app = express();

app.disable("x-powered-by");

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,

    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the SkillSwap API",
  });
});

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/skills", skillRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/wallet", walletRoutes);

app.use("/api/v1/availability", availabilityRoutes);

app.use("/api/v1/wallet", walletRoutes);

app.use("/api/v1/reviews", reviewRoutes);

app.use("/api/v1/disputes", disputeRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
