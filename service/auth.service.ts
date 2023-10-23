import { MongooseError } from "mongoose";
import { SessionModel } from "../model/session.model";
import { createJWT } from "../utils/jwt.utils";

interface UserPayloadInput {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

export async function createSession(userID: string) {
  try {
    return await SessionModel.create({ user_id: userID });
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message.toString());
    throw new Error("something went wrong");
  }
}

export function createAccessToken(payload: UserPayloadInput) {
  const access_token = createJWT({
    payload,
    secret: "ACCESS_PRIVATE_KEY",
    options: {
      expiresIn: "1m",
    },
  });

  return access_token;
}

export async function createRefreshToken(userID: string) {
  const session = await createSession(userID);

  const access_token = createJWT({
    payload: session.toJSON(),
    secret: "REFRESH_PRIVATE_KEY",
    options: {
      expiresIn: "1y",
    },
  });

  return access_token;
}
