import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { envVars } from "./app/config/env";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Travelyn Tour Management Backend",
  });
});

// global error handler
app.use(globalErrorHandler);

export default app;
