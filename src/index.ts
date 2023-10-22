import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "../utils/logger";
dotenv.config();

const PORT = 8090;

const app = express();

app.listen(PORT, () => logger.info(`Server is running on port : ${PORT}`));
