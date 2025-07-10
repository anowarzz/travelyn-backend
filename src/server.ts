import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { config } from "./app/config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(config.database_url as string);

    console.log("Connected to MongoDB");

    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

// Unhandled rejection handling
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected, Shutting down the server...");
  console.log("Error details:", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Uncaught exception handling
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected, Shutting down the server...");
  console.log("Error details:", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// signal shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received, Shutting down the server...");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  }
  process.exit(0);
});

// signal shutdown handling for SIGINT
process.on("SIGINT", () => {
  console.log("SIGINT signal received, Shutting down the server...");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  }
  process.exit(0);
});
