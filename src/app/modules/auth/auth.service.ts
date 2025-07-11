import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  //  check if user exist with this email
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Does Not Exist !");
  }
  // check password match
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
