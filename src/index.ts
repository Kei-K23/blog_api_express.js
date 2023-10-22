import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "../utils/logger";
import dbConnection from "../utils/dbConnection";
dotenv.config();
const dbURL = process.env.DB_URL as string;
const PORT = 8090;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  logger.info(`Server is running on port : ${PORT}`);
  dbConnection(dbURL);
});
