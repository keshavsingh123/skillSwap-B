import "dotenv/config";

import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 5000;

let server;

async function startServer() {
  try {
    await connectDatabase();

    server = app.listen(port, "0.0.0.0", () => {
      console.log(`SkillSwap API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);

    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      await disconnectDatabase();

      console.log("Application stopped successfully");

      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
This line is VERY IMPORTANT.
Without calling startServer(),
the Node process will simply exit.
*/
await startServer();
