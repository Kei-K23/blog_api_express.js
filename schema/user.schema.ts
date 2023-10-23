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
        .min(6, "password should be min length of 6"),
      confirm_password: z
        .string({
          required_error: "confirm password is required",
        })
        .min(6, "confirm password should be min length of 6"),
      phone: z.string().optional(),
      address: z.string().optional(),
      role: z.string().optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "confirm password must be same with password",
      path: ["confirm_password"],
    }),
});

export const CreateUserVerificationSchema = z.object({
  params: z.object({
    verify_code: z.string({
      required_error: "verify code is required",
    }),
    id: z.string({
      required_error: "user id is required",
    }),
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof CreateUserScheme>["body"],
  "confirm_password"
>;

export type CreateUserVerificationInput = TypeOf<
  typeof CreateUserVerificationSchema
>["params"];
