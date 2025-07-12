import { NextFunction, Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { validateRequest } from "../../middlewares/validateRequest";
import { verifyToken } from "../../utils/jwt";
import { userControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";

const router = Router();

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Access Token Found");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

      const userRole = (verifiedToken as JwtPayload).role;

      if (userRole !== Role.ADMIN) {
        throw new AppError(403, "Unauthorized access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/all-users", userControllers.getAllUsers);

export const UserRoutes = router;
