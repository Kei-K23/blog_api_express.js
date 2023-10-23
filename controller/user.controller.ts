import { Request, Response } from "express";
import {
  createUser,
  findUser,
  getAllUser,
  updateUser,
} from "../service/user.service";
import {
  CreateForgetPasswordInput,
  CreateUserInput,
  CreateUserVerificationInput,
} from "../schema/user.schema";
import { getTestMessageUrl } from "nodemailer";
import transporter from "../utils/mailer";
import { omit } from "../utils/utils";

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

    const reset_password_code = crypto.randomUUID().toString();

    transporter.sendMail(
      {
        from: "blog_api@gmail.com",
        to: user.email,
        subject: "Reset password code",
        text: `Password reset code and ID to reset your password
    Verify Code: ${reset_password_code} | user id: ${user._id}`,
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
