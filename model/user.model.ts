import mongoose from "mongoose";
import argon2 from "argon2";
import logger from "../utils/logger";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  suspended?: 0 | 1;
  role?: "admin" | "user";
  verifyPassword: (candidatePassword: string) => Promise<Boolean>;
}

interface UserModel extends mongoose.Model<UserDocument> {
  password: string;
  verifyPassword: (candidatePassword: string) => Promise<Boolean>;
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      min: [3, "name should be at least 3 character"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [
        {
          validator: async function (email: string) {
            const userExist = await UserModel.findOne({ email });
            if (userExist) throw new Error("email must be unique for one user");
            return true;
          },
        },
        {
          validator: async function (email: string) {
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
              email
            );
          },
          message: (prop) => `${prop.value} is not valid email format`,
        },
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [6, "password must be at least 6 length"],
    },
    phone: {
      type: String,
      validate: {
        validator: function (phone: string) {
          return /09-\d{9}/.test(phone);
        },
        message: (prop) => `${prop.value} is not valid phone number format`,
      },
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const hash_password = await argon2.hash(this.password);
  this.password = hash_password;
  next();
});

userSchema.static("verifyPassword", async function (candidatePassword: string) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (e: any) {
    logger.error(e.message);
    return false;
  }
});

export const UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);
