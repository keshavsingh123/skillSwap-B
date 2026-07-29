import mongoose from "mongoose";

function getDatabaseStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[mongoose.connection.readyState] || "unknown";
}

export function getHealthStatus(req, res) {
  res.status(200).json({
    success: true,
    message: "SkillSwap API is healthy",
    data: {
      environment: process.env.NODE_ENV,
      database: getDatabaseStatus(),
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
}
