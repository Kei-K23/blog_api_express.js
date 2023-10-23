import { Router } from "express";
import { createUserHandler } from "../controller/user.controller";
import validator from "../middleware/validator";
import { CreateUserScheme } from "../schema/user.schema";

export default function (router: Router) {
  router.post("/api/user", validator(CreateUserScheme), createUserHandler);
}
