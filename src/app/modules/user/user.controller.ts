/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Error creating user ${error}`,
    });
  }
};

export const userControllers = {
  createUser,
};
