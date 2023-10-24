import { Router } from "express";
import validator from "../middleware/validator";
import { CreateBlogSchema } from "../schema/blog.schema";
import {
  createBlogHandler,
  getAllBlogsHandler,
} from "../controller/blog.controller";
import requiredUser from "../middleware/requiredUser";
import refreshToken from "../middleware/refreshToken";

export default function (router: Router) {
  router.get("/api/blogs", refreshToken, requiredUser, getAllBlogsHandler);
  router.post(
    "/api/blogs/:user_id",
    refreshToken,
    requiredUser,
    validator(CreateBlogSchema),
    createBlogHandler
  );
}
