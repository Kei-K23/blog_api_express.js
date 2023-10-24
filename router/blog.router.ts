import { Router } from "express";
import validator from "../middleware/validator";
import { CreateBlogSchema } from "../schema/blog.schema";
import { createBlogHandler } from "../controller/blog.controller";
import requiredUser from "../middleware/requiredUser";
import refreshToken from "../middleware/refreshToken";

export default function (router: Router) {
  router.post(
    "/api/blog",
    refreshToken,
    requiredUser,
    validator(CreateBlogSchema),
    createBlogHandler
  );
}
