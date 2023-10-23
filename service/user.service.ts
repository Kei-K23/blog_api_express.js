import { FilterQuery, UpdateQuery } from "mongoose";
import { UserDocument, UserModel } from "../model/user.model";
import { CreateUserInput } from "../schema/user.schema";

export async function createUser(user: CreateUserInput) {
  try {
    return await UserModel.create(user);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function updateUser(
  filer: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>
) {
  try {
    const isUserExist = await UserModel.findOne(filer);
    if (!isUserExist)
      throw new Error("user does not exist! cannot verify account");
    return await UserModel.findOneAndUpdate(filer, update).lean();
  } catch (e: any) {
    throw new Error(e.message);
  }
}
