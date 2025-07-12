import { NextFunction, Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { validateRequest } from "../../middlewares/validateRequest";
import { verifyToken } from "../../utils/jwt";
import { userControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();



router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN)  ,userControllers.getAllUsers);

export const UserRoutes = router;
