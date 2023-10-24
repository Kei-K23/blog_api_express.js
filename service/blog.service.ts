import mongoose from "mongoose";
import { BlogModel } from "../model/blog.model";
import { CreateBlogInput, CreateBlogInputProp } from "../schema/blog.schema";
import { isEmpty } from "../utils/utils";

export async function createBlog(payload: CreateBlogInputProp) {
  try {
    return await BlogModel.create(payload);
  } catch (e: any) {
    if (e instanceof mongoose.MongooseError)
      throw new Error(e.message.toString());
    throw new Error(e.message.toString());
  }
}

export async function getAllBlogs() {
  try {
    const blogs = await BlogModel.find();
    if (isEmpty(blogs)) throw new Error("there is no blogs to provide");
    return blogs;
  } catch (e: any) {
    if (e instanceof mongoose.MongooseError)
      throw new Error(e.message.toString());
    throw new Error(e.message.toString());
  }
}
