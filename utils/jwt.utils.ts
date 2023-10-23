import jwt, { JsonWebTokenError, SignOptions } from "jsonwebtoken";
import config from "config";
interface SignInProp {
  payload: Record<string, any>;
  secret: "ACCESS_PRIVATE_KEY" | "REFRESH_PRIVATE_KEY";
  options?: SignOptions | undefined;
}

export function createJWT({ payload, secret, options }: SignInProp) {
  const key = config.get<string>(secret);
  return jwt.sign(payload, key, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJWT<T>(
  token: string,
  secret: "ACCESS_PUBLIC_KEY" | "REFRESH_PUBLIC_KEY"
): T | null {
  const key = config.get<string>(secret);

  try {
    const decoded = jwt.verify(token, key) as T;
    return decoded;
  } catch (e: any) {
    return null;
  }
}
