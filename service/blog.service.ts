import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import { BlogDocument, BlogModel } from "../model/blog.model";
import { CreateBlogAndUpdateProp } from "../schema/blog.schema";
import { isEmpty } from "../utils/utils";

export async function createBlog(payload: CreateBlogAndUpdateProp) {
  try {
    return await BlogModel.create(payload);
  } catch (e: any) {
    if (e instanceof mongoose.MongooseError)
      throw new Error(e.message.toString());
    throw new Error(e.message.toString());
  }
}

export async function updateBlog(
  filter: FilterQuery<BlogDocument>,
  update: UpdateQuery<BlogDocument>
) {
  try {
    const existing_blog = await BlogModel.findOne(filter);
    if (!existing_blog) throw new Error("blog does not exist!");
    return await BlogModel.findOneAndUpdate(filter, update);
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

export async function findBlog(filter: FilterQuery<BlogDocument>) {
  try {
    const blog = await BlogModel.findOne(filter);
    if (!blog) throw new Error("there is no blog to provide");
    return blog;
  } catch (e: any) {
    if (e instanceof mongoose.MongooseError)
      throw new Error(e.message.toString());
    throw new Error(e.message.toString());
  }
}

export async function deleteBlog(filter: FilterQuery<BlogDocument>) {
  try {
    const blog = await BlogModel.findOne(filter);
    if (!blog) throw new Error("there is no blog to provide");
    await BlogModel.findOneAndDelete(filter);
  } catch (e: any) {
    if (e instanceof mongoose.MongooseError)
      throw new Error(e.message.toString());
    throw new Error(e.message.toString());
  }
}
