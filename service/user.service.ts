import { FilterQuery, MongooseError, UpdateQuery } from "mongoose";
import { UserDocument, UserModel } from "../model/user.model";
import { CreateUserInput } from "../schema/user.schema";
import { isEmpty } from "../utils/utils";

export async function createUser(user: CreateUserInput) {
  try {
    return await UserModel.create(user);
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message.toString());
    throw new Error("something went wrong");
  }
}

export async function getAllUser() {
  try {
    const users = UserModel.find();
    if (isEmpty(users)) throw new Error("there is no users");

    return users;
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message.toString());
    throw new Error("something went wrong");
  }
}

export async function findUser(filter: FilterQuery<UserDocument>) {
  try {
    const user = await UserModel.findOne(filter);
    if (!user) throw new Error("user is not exist! register first");
    return user;
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message.toString());
    throw new Error("something went wrong");
  }
}

export async function updateUser(
  filter: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>
) {
  try {
    const isUserExist = await UserModel.findOne(filter);
    if (!isUserExist)
      throw new Error("user does not exist! cannot verify account");
    return await UserModel.findOneAndUpdate(filter, update).lean();
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message.toString());
    throw new Error("something went wrong");
  }
}
