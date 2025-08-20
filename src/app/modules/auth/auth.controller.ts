/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userTokens";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = createUserToken(user);

      // delete user.toObject().password;

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: { accessToken: userTokens.accessToken, user: rest },
      });
    })(req, res, next);
  }
);

// refresh token
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(
        new AppError(httpStatus.BAD_REQUEST, "No Request Token Found")
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true, 
      statusCode: httpStatus.CREATED,
      message: "Access Token Retrived Successfully",
      data: tokenInfo,
    });
  }
);

// logout user
const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

// change password
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    await AuthServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  }
);
// google callback
const googleCallBack = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "/";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    console.log(user, "user in google callback");

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_DEV_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logOut,
  changePassword,
  googleCallBack,
};
