import supertest from "supertest";
import { createServer } from "../utils/server";
import mongoose from "mongoose";

const app = createServer();

describe("user", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27018/blogs_api");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  it("get all user with status code 200", function (done) {
    supertest(app)
      .get("/api/user/all")
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
    done();
  });
});
