import express from "express";
import cors from "cors";
import cookie from "../middleware/cookie";
import router from "../router";
import deserializedUser from "../middleware/deserializedUser";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookie);
  app.use(deserializedUser);
  app.use(router());

  return app;
}
