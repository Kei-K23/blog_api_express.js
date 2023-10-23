import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";

export default function (req: Request, res: Response, next: NextFunction) {
  const jwt_access_token = res.locals.cookie.blog_api_access_cookie;

  if (!jwt_access_token) return next();

  const decoded = verifyJWT(jwt_access_token, "ACCESS_PUBLIC_KEY");

  if (!decoded) return next();

  if (res.locals.user) return next();

  res.locals.user = decoded;

  return next();
}
