import { Router } from "express";
import {
  createUserHandler,
  forgetPasswordHandler,
  getAllUserByAdminUserHandler,
  getAuthUserHandler,
  resetPasswordHandler,
  userVerificationHandler,
} from "../controller/user.controller";
import validator from "../middleware/validator";
import {
  CreateForgetPasswordSchema,
  CreateResetPasswordSchema,
  CreateUserScheme,
  CreateUserVerificationSchema,
} from "../schema/user.schema";
import requiredUser from "../middleware/requiredUser";

export default function (router: Router) {
  router.get("/api/user/all", getAllUserByAdminUserHandler);
  router.get("/api/user", requiredUser, getAuthUserHandler);
  router.post("/api/user", validator(CreateUserScheme), createUserHandler);
  router.post(
    "/api/user/verify/:verify_code/:id",
    validator(CreateUserVerificationSchema),
    userVerificationHandler
  );
  router.post(
    "/api/user/forget_password/:id",
    validator(CreateForgetPasswordSchema),
    forgetPasswordHandler
  );
  router.post(
    "/api/user/reset_password/:password_reset_code/:id",
    validator(CreateResetPasswordSchema),
    resetPasswordHandler
  );
}
