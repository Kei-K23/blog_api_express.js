import { Request, Response, NextFunction } from "express";

interface ParsedCookie {
  [key: string]: string;
}

export default function (req: Request, res: Response, next: NextFunction) {
  const {
    headers: { cookie },
  } = req;

  if (cookie) {
    const values = cookie.split(";").reduce((res: ParsedCookie, item) => {
      const data = item.trim().split("=");
      return { ...res, [data[0]]: data[1] };
    }, {});
    res.locals.cookie = values;
  } else {
    res.locals.cookie = {};
  }
  return next();
}
