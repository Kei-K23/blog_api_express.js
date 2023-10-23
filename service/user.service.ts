import { UserModel } from "../model/user.model";
import { CreateUserInput } from "../schema/user.schema";

export async function createUser(user: CreateUserInput) {
  try {
    return await UserModel.create(user);
  } catch (e: any) {
    throw new Error(e);
  }
}
