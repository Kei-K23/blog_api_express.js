import { Request, Response } from "express";
import {
  CreateSessionInput,
  CreateSessionLoginOutInput,
} from "../schema/session.schema";
import { findUser } from "../service/user.service";
import { UserModel } from "../model/user.model";
import {
  createAccessToken,
  createRefreshToken,
  findSession,
  updateSession,
} from "../service/auth.service";
import config from "config";
import { verifyJWT } from "../utils/jwt.utils";

const ACCESS_TOKEN_EXPIRED = config.get<number>("ACCESS_TOKEN_EXPIRED");
const REFRESH_TOKEN_EXPIRED = config.get<number>("REFRESH_TOKEN_EXPIRED");
export async function loginHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  try {
    const jwt_access_token = res.locals.cookie.blog_api_access_cookie ?? "";
    const jwt_refresh_token = res.locals.cookie.blog_api_refresh_cookie ?? "";

    if (jwt_access_token && jwt_refresh_token)
      return res.status(400).json({
        status: 400,
        error:
          "user is still login! please make sure to logout before another login",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
          loging_url: "http://localhost:8090/api/auth/login",
          logout_url: "http://localhost:8090/api/auth/logout/:id",
        },
      });

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
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
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
          loging_url: "http://localhost:8090/api/auth/login",
          logout_url: "http://localhost:8090/api/auth/logout/:id",
        },
      })
      .end();
  }
}

export async function logoutHandler(
  req: Request<CreateSessionLoginOutInput>,
  res: Response
) {
  try {
    const jwt_access_token = res.locals.cookie.blog_api_access_cookie ?? "";
    const jwt_refresh_token = res.locals.cookie.blog_api_refresh_cookie ?? "";
    const id = req.params.id;

    const access_token_decoded = verifyJWT(
      jwt_access_token,
      "ACCESS_PUBLIC_KEY"
    );

    if (!access_token_decoded)
      return res.status(401).json({
        status: 401,
        error: "could not logout! unauthorized user",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
          loging_url: "http://localhost:8090/api/auth/login",
          logout_url: "http://localhost:8090/api/auth/logout/:id",
        },
      });
    const refresh_token_decoded = verifyJWT<{
      user_id: string;
      _id: string;
      valid: boolean;
    }>(jwt_refresh_token, "REFRESH_PUBLIC_KEY");

    if (!refresh_token_decoded)
      return res.status(401).json({
        status: 401,
        error: "could not logout! unauthorized user",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
          loging_url: "http://localhost:8090/api/auth/login",
          logout_url: "http://localhost:8090/api/auth/logout/:id",
        },
      });

    if (id !== refresh_token_decoded.user_id)
      return res.status(401).json({
        status: 401,
        error: "unauthorized! you are not authorized user",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
          loging_url: "http://localhost:8090/api/auth/login",
          logout_url: "http://localhost:8090/api/auth/logout/:id",
        },
      });

    const session = await findSession({
      _id: refresh_token_decoded._id,
      user_id: refresh_token_decoded.user_id,
    });

    if (!session || !session.valid)
      return res
        .status(401)
        .json({
          status: 401,
          message: "could not refresh jwt token!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
            loging_url: "http://localhost:8090/api/auth/login",
            logout_url: "http://localhost:8090/api/auth/logout/:id",
          },
        })
        .end();

    await updateSession({ _id: session._id }, { valid: false });

    res.clearCookie("blog_api_access_cookie", {
      domain: "localhost",
      path: "/",
    });
    res.clearCookie("blog_api_refresh_cookie", {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json({
      status: 200,
      message: "successfully logout",
      links: {
        verify_url: "http://localhost:8090/api/user/:verify_code/:id",
        register_url: "http://localhost:8090/api/user",
        loging_url: "http://localhost:8090/api/auth/login",
        logout_url: "http://localhost:8090/api/auth/logout/:id",
      },
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
