import { TypeOf, z } from "zod";

export const CreateUserScheme = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "name is required" })
        .min(3, "name should be at least 3 character"),
      email: z
        .string({ required_error: "name is required" })
        .email("invalid email"),
      password: z
        .string({
          required_error: "password is required",
        })
        .min(6, "password must be at least 6 length"),
      confirm_password: z
        .string({
          required_error: "confirm password is required",
        })
        .min(6, "confirm password must be at least 6 length"),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "password did not match",
      path: ["password", "confirm_password"],
    }),
});

export type CreateUserInput = TypeOf<typeof CreateUserScheme>["body"];
