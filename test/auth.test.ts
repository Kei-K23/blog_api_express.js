// import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import { createServer } from "../utils/server";
// import supertest from "supertest";
// const app = createServer();

// describe("auth", () => {
//   beforeAll(async () => {
//     const mongoServer = await MongoMemoryServer.create();

//     await mongoose.connect(mongoServer.getUri());
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoose.connection.close();
//   });

//   it("successfully login with status code 200", function (done) {
//     supertest(app)
//       .post("/api/auth/login")
//       .then((res) => expect(res.statusCode).toBe(200));
//     done();
//   });
// });
