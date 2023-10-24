import { Router } from "express";
import validator from "../middleware/validator";
import {
  CreateBlogSchema,
  CreateUpdateBlogSchema,
} from "../schema/blog.schema";

import {
  createBlogHandler,
  getAllBlogsHandler,
  updateBlogHandler,
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
  router.post(
    "/api/blogs/:blog_id/:user_id",
    refreshToken,
    requiredUser,
    validator(CreateUpdateBlogSchema),
    updateBlogHandler
  );
}
