import { Request, Response } from "express";
import { findUser } from "../service/user.service";
import { verifyJWT } from "../utils/jwt.utils";
import { CreateBlogInput, CreateUpdateBlogInput } from "../schema/blog.schema";
import {
  createBlog,
  findBlog,
  getAllBlogs,
  updateBlog,
} from "../service/blog.service";
import { isEmpty, omit } from "../utils/utils";

export async function getAllBlogsHandler(req: Request, res: Response) {
  try {
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

    const blogs = await getAllBlogs();

    if (isEmpty(blogs))
      return res
        .status(400)
        .json({ status: 400, error: "there is no blogs to provide" })
        .end();

    return res
      .status(200)
      .json({
        status: 200,
        message: "retireve all blogs",
        data: blogs,
      })
      .end();
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

export async function createBlogHandler(
  req: Request<CreateBlogInput["params"], {}, CreateBlogInput["body"]>,
  res: Response
) {
  try {
    const user_id = req.params.user_id;
    // const { body, title, topic, sub_title } = req.body;
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

    const blog = await createBlog({ ...req.body, user_id });

    return res.status(201).json({
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

export async function updateBlogHandler(
  req: Request<
    CreateUpdateBlogInput["params"],
    {},
    CreateUpdateBlogInput["body"]
  >,
  res: Response
) {
  try {
    const { user_id, blog_id } = req.params;
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

    if (isEmpty(req.body))
      return res
        .status(400)
        .json({ status: 400, error: "missing request body to update" })
        .end();

    const valid_blog_to_update = await findBlog({
      _id: blog_id,
      user_id,
    });

    if (!valid_blog_to_update)
      return res
        .status(403)
        .json({ status: 403, error: "cound not update blog! unauthorized" })
        .end();

    const updatedBlog = await updateBlog(
      { _id: valid_blog_to_update._id },
      req.body
    );

    return res
      .status(200)
      .json({
        status: 200,
        message: "successfully update the blog",
        data: updatedBlog,
      })
      .end();
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
