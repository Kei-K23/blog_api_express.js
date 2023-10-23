import { Request, Response } from "express";
import {
  createUser,
  findUser,
  getAllUser,
  updateUser,
} from "../service/user.service";
import {
  CreateForgetPasswordInput,
  CreateResetPasswordInputForBody,
  CreateResetPasswordInputForParams,
  CreateUserInput,
  CreateUserVerificationInput,
} from "../schema/user.schema";
import { getTestMessageUrl } from "nodemailer";
import transporter from "../utils/mailer";
import { omit } from "../utils/utils";
import { UserModel } from "../model/user.model";
import argon2 from "argon2";
import { verifyJWT } from "../utils/jwt.utils";
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const user = req.body;
    const newUser = (await createUser(user)).toJSON();

    const verify_code = crypto.randomUUID().toString();
    transporter.sendMail(
      {
        from: "blog_api@gmail.com",
        to: newUser.email,
        subject: "Account verification",
        text: `User verify code and ID to verify your account
    Verify Code: ${verify_code} | user id: ${newUser._id}`,
      },
      (error, info) => {
        if (error)
          return res
            .status(500)
            .json({
              status: 500,
              error: "error happened while sending email",
              links: {
                verify_url: "http://localhost:8090/api/user/:verify_code/:id",
                register_url: "http://localhost:8090/api/user",
              },
            })
            .end();

        return res
          .status(201)
          .json({
            status: 201,
            message:
              "successful register! please follow the URL to verify your account",
            links: {
              verify_url: getTestMessageUrl(info),
            },
          })
          .end();
      }
    );
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}

export async function userVerificationHandler(
  req: Request<CreateUserVerificationInput>,
  res: Response
) {
  try {
    const { id, verify_code } = req.params;

    const existingUser = await findUser({ _id: id });
    if (existingUser.verify === true)
      return res
        .status(400)
        .json({
          status: 400,
          error: "this account is already verify",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    const updatedUser = await updateUser(
      { _id: id },
      { verify_code, verify: true }
    );
    return res
      .status(200)
      .json({
        status: 200,
        message: "successfully verify your account",
        data: omit(updatedUser, [
          "password",
          "__v",
          "suspended",
          "verify",
          "verify_code",
          "password_reset_code",
        ]),
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}

export async function getAllUserByAdminUserHandler(
  req: Request,
  res: Response
) {
  try {
    const users = await getAllUser();

    return res
      .status(200)
      .json({ message: "retrieve users data", data: users })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}

export async function forgetPasswordHandler(
  req: Request<
    CreateForgetPasswordInput["params"],
    {},
    CreateForgetPasswordInput["body"]
  >,
  res: Response
) {
  try {
    const id = req.params.id;
    const email = req.body.email;

    const user = await findUser({ _id: id, email });

    if (!user?.verify)
      return res
        .status(400)
        .json({
          status: 400,
          error: "user is not verify yet!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    const password_reset_code = crypto.randomUUID().toString();
    await updateUser({ _id: id }, { password_reset_code });

    transporter.sendMail(
      {
        from: "blog_api@gmail.com",
        to: user.email,
        subject: "Reset password code",
        text: `Password reset code and ID to reset your password
    Verify Code: ${password_reset_code} | user id: ${user._id}`,
      },
      (error, info) => {
        if (error)
          return res
            .status(500)
            .json({
              status: 500,
              error: "error happened while sending email",
              links: {
                verify_url: "http://localhost:8090/api/user/:verify_code/:id",
                register_url: "http://localhost:8090/api/user",
              },
            })
            .end();

        return res
          .status(200)
          .json({
            status: 200,
            message:
              "successful sent reset password code! please follow the URL to verify your account",
            links: {
              verify_url: getTestMessageUrl(info),
            },
          })
          .end();
      }
    );
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}

export async function resetPasswordHandler(
  req: Request<
    CreateResetPasswordInputForParams,
    {},
    CreateResetPasswordInputForBody
  >,
  res: Response
) {
  const { id, password_reset_code } = req.params;
  const password = req.body.password;
  try {
    const user = await findUser({ _id: id });

    if (!user)
      return res
        .status(400)
        .json({
          status: 400,
          error: "user does not exist!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    if (!user.verify)
      return res
        .status(400)
        .json({
          status: 400,
          error: "user is not verify yet!",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    if (password_reset_code !== user.password_reset_code)
      return res
        .status(400)
        .json({
          status: 400,
          error:
            "password reset code did not match! please use valid password reset code",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    const new_hash_password = await argon2.hash(password);

    await updateUser({ _id: user._id }, { password: new_hash_password });

    await updateUser({ _id: user._id }, { password_reset_code: null });

    return res.status(200).json({
      status: 200,
      message: "user password is successfully reset",
      links: {
        verify_url: "http://localhost:8090/api/user/:verify_code/:id",
        register_url: "http://localhost:8090/api/user",
      },
    });
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}

export async function getAuthUserHandler(req: Request, res: Response) {
  try {
    const jwt_access_token = res.locals.cookie.blog_api_access_cookie;

    if (!jwt_access_token)
      return res.status(401).json({
        status: 401,
        message: "there is no JWT token to authorize",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      });

    const decoded = verifyJWT<{
      user_id: string;
      name: string;
      email: string;
      role: string;
    }>(jwt_access_token, "ACCESS_PUBLIC_KEY");

    if (!decoded)
      return res.status(401).json({
        status: 401,
        message: "invalid JWT token",
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      });

    const auth_user = (await findUser({ _id: decoded.user_id })).toJSON();

    if (!auth_user)
      return res
        .status(401)
        .json({
          status: 401,
          message: "unauthorized user",
          links: {
            verify_url: "http://localhost:8090/api/user/:verify_code/:id",
            register_url: "http://localhost:8090/api/user",
          },
        })
        .end();

    return res
      .status(200)
      .json({
        status: 200,
        message: "authorized user",
        data: omit(auth_user, [
          "password",
          "__v",
          "suspended",
          "verify",
          "verify_code",
          "password_reset_code",
        ]),
      })
      .end();
  } catch (e: any) {
    return res
      .status(500)
      .json({
        status: 500,
        error: e.message,
        links: {
          verify_url: "http://localhost:8090/api/user/:verify_code/:id",
          register_url: "http://localhost:8090/api/user",
        },
      })
      .end();
  }
}
