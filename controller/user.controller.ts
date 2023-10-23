import { Request, Response } from "express";
import { createUser, updateUser } from "../service/user.service";
import {
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
        if (error) throw new Error("error while sending email");

        return res.status(200).json({
          message:
            "successful register! please follow the URL to verify your account",
          url: getTestMessageUrl(info),
        });
      }
    );
  } catch (e: any) {
    return res.status(500).json({ error: e.message }).end();
  }
}

export async function userVerificationHandler(
  req: Request<CreateUserVerificationInput>,
  res: Response
) {
  try {
    const { verify_code, id } = req.params;

    const updatedUser = await updateUser(
      { _id: id },
      { verify_code, verify: true }
    );
    return res.status(200).json({
      message: "successfully verify your account",
      user: omit(updatedUser, [
        "password",
        "_id",
        "__v",
        "suspended",
        "verify",
        "verify_code",
        "password_reset_code",
      ]),
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message }).end();
  }
}
