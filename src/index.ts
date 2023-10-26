import * as dotenv from "dotenv";
import logger from "../utils/logger";
import dbConnection from "../utils/dbConnection";
import config from "config";
import { createServer } from "../utils/server";

dotenv.config();

const dbURL = config.get<string>("DB_URL");
const PORT = config.get<number>("PORT");

const app = createServer();

app.listen(PORT, () => {
  logger.info(`Server is running on port : ${PORT}`);

  dbConnection(dbURL);
});
