import { Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.router";
import blogRouter from "./blog.router";

const router = Router();

export default function () {
  userRouter(router);
  authRouter(router);
  blogRouter(router);
  return router;
}
