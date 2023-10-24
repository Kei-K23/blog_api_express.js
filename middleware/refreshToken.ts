import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { findUser } from "../service/user.service";
import config from "config";
import { createAccessToken, findSession } from "../service/auth.service";
const ACCESS_TOKEN_EXPIRED = config.get<number>("ACCESS_TOKEN_EXPIRED");

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt_access_token = res.locals.cookie.blog_api_access_cookie ?? "";
  const jwt_refresh_token = res.locals.cookie.blog_api_refresh_cookie ?? "";

  if (jwt_access_token) return next();

  const access_token_decoded = verifyJWT(jwt_access_token, "ACCESS_PUBLIC_KEY");
  if (access_token_decoded) return next();

  if (!jwt_refresh_token)
    return res
      .status(401)
      .json({
        status: 401,
        message:
          "could not refresh jwt token! missing refresh token. Please login again",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();

  const refresh_token_decoded = verifyJWT<{
    user_id: string;
    _id: string;
    valid: boolean;
  }>(jwt_refresh_token, "REFRESH_PUBLIC_KEY");

  if (!refresh_token_decoded || !refresh_token_decoded.valid)
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

  const session = await findSession({
    _id: refresh_token_decoded._id,
    user_id: refresh_token_decoded.user_id,
    valid: true,
  });

  if (!session)
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

  const user = (await findUser({ _id: session.user_id })).toJSON();

  const new_jwt_access_token = createAccessToken({
    name: user.name,
    email: user.email,
    role: user.role,
    user_id: user._id,
  });

  res.cookie("blog_api_access_cookie", new_jwt_access_token, {
    domain: "localhost",
    path: "/",
    maxAge: ACCESS_TOKEN_EXPIRED,
  });

  res.locals.cookie.blog_api_access_cookie = new_jwt_access_token;

  next();
}
