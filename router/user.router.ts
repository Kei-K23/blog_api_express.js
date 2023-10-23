import { Router } from "express";
import {
  createUserHandler,
  forgetPasswordHandler,
  getAllUserByAdminUserHandler,
  userVerificationHandler,
} from "../controller/user.controller";
import validator from "../middleware/validator";
import {
  CreateForgetPasswordSchema,
  CreateUserScheme,
  CreateUserVerificationSchema,
} from "../schema/user.schema";

export default function (router: Router) {
  router.get("/api/user", getAllUserByAdminUserHandler);
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
}
