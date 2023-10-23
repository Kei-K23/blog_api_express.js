import { Router } from "express";
import {
  createUserHandler,
  userVerificationHandler,
} from "../controller/user.controller";
import validator from "../middleware/validator";
import {
  CreateUserScheme,
  CreateUserVerificationSchema,
} from "../schema/user.schema";

export default function (router: Router) {
  router.post("/api/user", validator(CreateUserScheme), createUserHandler);
  router.post(
    "/api/user/:verify_code/:id",
    validator(CreateUserVerificationSchema),
    userVerificationHandler
  );
}
