/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";

// create a user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  }
);

// update a user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await userServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

// get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "All Users Retrived Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUsers,
  updateUser,
};
