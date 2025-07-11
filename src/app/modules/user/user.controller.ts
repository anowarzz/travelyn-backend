import { userServices } from "./user.service";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

// create a user
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};



// get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUsers();

    res.status(httpStatus.OK).json({
      success: true,
      message: "All users retrieved successfully",
      data: users,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUsers,
};
