import { Request, Response } from "express";
import { findUser } from "../service/user.service";
import { verifyJWT } from "../utils/jwt.utils";
import { CreateBlogInput } from "../schema/blog.schema";
import { createBlog } from "../service/blog.service";

export async function createBlogHandler(
  req: Request<{}, {}, CreateBlogInput>,
  res: Response
) {
  try {
    const user_id = req.body.user_id;
    const jwt_access_token = res.locals.cookie.blog_api_access_cookie;

    const decoded = verifyJWT<{
      user_id: string;
      name: string;
      email: string;
      role: string;
    }>(jwt_access_token, "ACCESS_PUBLIC_KEY");

    if (!jwt_access_token)
      return res
        .status(401)
        .json({
          status: 401,
          message: "there is no JWT token to authorize",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
          },
        })
        .end();

    if (!decoded)
      return res
        .status(403)
        .json({
          status: 403,
          message: "invalid JWT access token!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
          },
        })
        .end();

    const user = await findUser({ _id: user_id });

    if (!user)
      return res
        .status(400)
        .json({
          status: 400,
          error: "user does not exist!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
          },
        })
        .end();

    if (!user.verify)
      return res
        .status(400)
        .json({
          status: 400,
          error: "user is not verify yet!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
          },
        })
        .end();

    if (user._id.toString() !== decoded.user_id.toString())
      return res
        .status(403)
        .json({
          status: 403,
          message: "unauthorized user!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
          },
        })
        .end();

    const blog = await createBlog(req.body);

    return res
      .status(201)
      .json({
        status: 201,
        message: "successfully created new blog",
        data: blog,
      });
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
          loging_url: "http://localhost:8090/api/auth/login",
          logout_url: "http://localhost:8090/api/auth/logout/:id",
        },
      })
      .end();
  }
}
