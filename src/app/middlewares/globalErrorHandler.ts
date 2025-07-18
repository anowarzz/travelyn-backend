/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong !`;

  // duplicate error
  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exists!`;
  }
// cast error   / Object Id
else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid MogoDB ObjectId . Please provide a valid ObjectId`;

}


  // custom error 
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
