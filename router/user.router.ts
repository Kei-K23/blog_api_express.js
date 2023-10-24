import { Router } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  forgetPasswordHandler,
  getAllUserByAdminUserHandler,
  getAuthUserHandler,
  resetPasswordHandler,
  updateUserHandler,
  userVerificationHandler,
} from "../controller/user.controller";
import validator from "../middleware/validator";
import {
  CreateDeleteUserSchema,
  CreateForgetPasswordSchema,
  CreateResetPasswordSchema,
  CreateUpdateUserSchema,
  CreateUserScheme,
  CreateUserVerificationSchema,
} from "../schema/user.schema";
import requiredUser from "../middleware/requiredUser";
import refreshToken from "../middleware/refreshToken";

export default function (router: Router) {
  router.get("/api/user/all", getAllUserByAdminUserHandler);
  router.get("/api/user", refreshToken, requiredUser, getAuthUserHandler);
  router.post("/api/user", validator(CreateUserScheme), createUserHandler);
  router.post(
    "/api/user/verify/:verify_code/:id",
    validator(CreateUserVerificationSchema),
    userVerificationHandler
  );
  router.post(
    "/api/user/forget_password/:id",
    refreshToken,
    requiredUser,
    validator(CreateForgetPasswordSchema),
    forgetPasswordHandler
  );
  router.post(
    "/api/user/reset_password/:password_reset_code/:id",
    refreshToken,
    requiredUser,
    validator(CreateResetPasswordSchema),
    resetPasswordHandler
  );
  router.put(
    "/api/user/:id",
    refreshToken,
    requiredUser,
    validator(CreateUpdateUserSchema),
    updateUserHandler
  );
  router.delete(
    "/api/user/:id",
    refreshToken,
    requiredUser,
    validator(CreateDeleteUserSchema),
    deleteUserHandler
  );
}
