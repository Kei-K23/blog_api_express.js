import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/session.schema";
import { findUser } from "../service/user.service";
import { UserModel } from "../model/user.model";
import { createAccessToken, createRefreshToken } from "../service/auth.service";
import config from "config";

const ACCESS_TOKEN_EXPIRED = config.get<number>("ACCESS_TOKEN_EXPIRED");
const REFRESH_TOKEN_EXPIRED = config.get<number>("REFRESH_TOKEN_EXPIRED");
export async function loginHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const user = (await findUser({ email })).toJSON();

    if (!user)
      return res
        .status(400)
        .json({
          status: 400,
          error: "user does not exist!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
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
          },
        })
        .end();

    const isAuthUser = await UserModel.verifyPassword(user.password, password);

    if (!isAuthUser)
      return res
        .status(401)
        .json({
          status: 401,
          error: "unauthorized user! use correct password and email!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    const access_token = createAccessToken({
      user_id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const refresh_token = await createRefreshToken(user._id);

    res.cookie("blog_api_access_cookie", access_token, {
      domain: "localhost",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRED,
    });

    res.cookie("blog_api_refresh_cookie", refresh_token, {
      domain: "localhost",
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRED,
    });

    return res.status(200).json({
      status: 200,
      message: "successfully login",
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
        },
      })
      .end();
  }
}

export async function logoutHandler(req: Request, res: Response) {
  try {
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}
