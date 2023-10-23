import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "../utils/logger";
import dbConnection from "../utils/dbConnection";
import router from "../router";
import config from "config";
import cookie from "../middleware/cookie";
import deserializedUser from "../middleware/deserializedUser";
dotenv.config();

const dbURL = config.get<string>("DB_URL");
const PORT = config.get<number>("PORT");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookie);
app.use(deserializedUser);
app.use(router());
app.listen(PORT, () => {
  logger.info(`Server is running on port : ${PORT}`);

  dbConnection(dbURL);
});
