import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const jwt_access_token = res.locals.cookie.blog_api_access_cookie;
  if (!jwt_access_token)
    return res.status(401).json({
      status: 401,
      message: "user's credentials is required",
      links: {
        verify_url: "http://localhost:8090/api/user/:verify_code/:id",
        register_url: "http://localhost:8090/api/user",
      },
    });

  return next();
}
