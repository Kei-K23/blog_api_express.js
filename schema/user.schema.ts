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

export const CreateUpdateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "name should be at least 3 character").optional(),
    email: z.string().email("invalid email").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.string().optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: "user id is required",
    }),
  }),
});
export const CreateDeleteUserSchema = z.object({
  params: z.object({
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

export type CreateForgetPasswordInput = TypeOf<
  typeof CreateForgetPasswordSchema
>;

export type CreateResetPasswordInputForParams = TypeOf<
  typeof CreateResetPasswordSchema
>["params"];
export type CreateResetPasswordInputForBody = Omit<
  TypeOf<typeof CreateResetPasswordSchema>["body"],
  "confirm_password"
>;

export type CreateUpdateUserInput = TypeOf<typeof CreateUpdateUserSchema>;

export type CreateDeleteUserInput = TypeOf<
  typeof CreateDeleteUserSchema
>["params"];
