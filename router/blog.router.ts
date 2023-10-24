import { Router } from "express";
import validator from "../middleware/validator";
import {
  CreateBlogSchema,
  CreateDeleteBlogSchema,
  CreateUpdateBlogSchema,
} from "../schema/blog.schema";

import {
  createBlogHandler,
  deleteBlogHandler,
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
  router.put(
    "/api/blogs/:blog_id/:user_id",
    refreshToken,
    requiredUser,
    validator(CreateUpdateBlogSchema),
    updateBlogHandler
  );
  router.delete(
    "/api/blogs/:blog_id/:user_id",
    refreshToken,
    requiredUser,
    validator(CreateDeleteBlogSchema),
    deleteBlogHandler
  );
}
