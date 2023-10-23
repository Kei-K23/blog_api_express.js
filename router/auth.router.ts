import { Router } from "express";
import validator from "../middleware/validator";
import { CreateSessionSchema } from "../schema/session.schema";
import { loginHandler } from "../controller/auth.controller";

export default function (router: Router) {
  router.post("/api/auth/login", validator(CreateSessionSchema), loginHandler);
}
