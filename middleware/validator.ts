import { Request, Response, NextFunction } from "express";

import { AnyZodObject, ZodError } from "zod";

export default (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (e: any) {
      return res.status(500).json({ error: e.errors[0].message });
    }
  };
