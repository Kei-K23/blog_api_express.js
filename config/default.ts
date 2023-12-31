import * as dotenv from "dotenv";
dotenv.config();

const { access_private_key } = JSON.parse(
  process.env.ACCESS_PRIVATE_KEY as string
);
const { access_public_key } = JSON.parse(
  process.env.ACCESS_PUBLIC_KEY as string
);
const { refresh_private_key } = JSON.parse(
  process.env.REFRESH_PRIVATE_KEY as string
);
const { refresh_public_key } = JSON.parse(
  process.env.REFRESH_PUBLIC_KEY as string
);

export default {
  PORT: 8090,
  ACCESS_TOKEN_EXPIRED: 60000, // 3.6e+6 (1h)
  REFRESH_TOKEN_EXPIRED: 3.154e10, // 2.628e+9 (1 month) /  3.154e10(1 year)
  DB_URL: process.env.DB_URL,
  ACCESS_PRIVATE_KEY: access_private_key,
  ACCESS_PUBLIC_KEY: access_public_key,
  REFRESH_PRIVATE_KEY: refresh_private_key,
  REFRESH_PUBLIC_KEY: refresh_public_key,
};
