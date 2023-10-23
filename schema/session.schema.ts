import { TypeOf, z } from "zod";

export const CreateSessionSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "email is required" })
      .email("invalid email"),

    password: z
      .string({
        required_error: "password is required",
      })
      .min(6, "password should be min length of 6"),
  }),
});

export type CreateSessionInput = TypeOf<typeof CreateSessionSchema>["body"];
