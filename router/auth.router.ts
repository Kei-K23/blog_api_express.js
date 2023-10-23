import { Router } from "express";
import validator from "../middleware/validator";
import {
  CreateSessionLoginOutSchema,
  CreateSessionSchema,
} from "../schema/session.schema";
import { loginHandler, logoutHandler } from "../controller/auth.controller";

export default function (router: Router) {
  router.post("/api/auth/login", validator(CreateSessionSchema), loginHandler);
  router.post(
    "/api/auth/logout/:id",
    validator(CreateSessionLoginOutSchema),
    logoutHandler
  );
}
