import mongoose from "mongoose";
import logger from "./logger";

export default async function (dbURL: string) {
  try {
    await mongoose.connect(dbURL);
    logger.info("database connection was successful");
  } catch (e: any) {
    logger.error(e.message);
  }
}
