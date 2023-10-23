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

export const CreateSessionLoginOutSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "user id is required",
    }),
  }),
});

export type CreateSessionInput = TypeOf<typeof CreateSessionSchema>["body"];
export type CreateSessionLoginOutInput = TypeOf<
  typeof CreateSessionLoginOutSchema
>["params"];
