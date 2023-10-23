import { TypeOf, z } from "zod";

export const CreateUserScheme = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "name is required" })
        .min(3, "name should be at least 3 character"),
      email: z
        .string({ required_error: "email is required" })
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

export const CreateForgetPasswordSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "user id is required",
    }),
  }),
  body: z.object({
    email: z
      .string({ required_error: "email is required" })
      .email("invalid email"),
  }),
});
export const CreateResetPasswordSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "user id is required",
    }),
    password_reset_code: z.string({
      required_error: "reset password code is required",
    }),
  }),
  body: z
    .object({
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
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "confirm password must be same with password",
      path: ["confirm_password"],
    }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof CreateUserScheme>["body"],
  "confirm_password"
>;

export type CreateUserVerificationInput = TypeOf<
  typeof CreateUserVerificationSchema
>["params"];

export type CreateForgetPasswordInput = TypeOf<
  typeof CreateForgetPasswordSchema
>;

export type CreateSessionInput = Omit<
  TypeOf<typeof CreateUserScheme>["body"],
  "password" | "confirm_password" | "suspended" | "address" | "phone"
>;

export type CreateResetPasswordInputForParams = TypeOf<
  typeof CreateResetPasswordSchema
>["params"];
export type CreateResetPasswordInputForBody = Omit<
  TypeOf<typeof CreateResetPasswordSchema>["body"],
  "confirm_password"
>;
