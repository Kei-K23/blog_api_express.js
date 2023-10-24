import mongoose from "mongoose";

type CommentType = {
  user_id: mongoose.ObjectId;
  comment: string;
};

export interface BlogDocument extends mongoose.Document {
  title: string;
  sub_title?: string | undefined;
  topic:
    | "programming"
    | "computer science"
    | "sport"
    | "music"
    | "movie"
    | string;
  body: string;
  user_id: mongoose.ObjectId;
  comments?: Array<CommentType>;
}

const blogSchema = new mongoose.Schema<BlogDocument>(
  {
    title: {
      type: String,
      required: true,
      min: [10, "title length should be at least 10 characters"],
    },
    sub_title: {
      type: String,
      min: [5, "sub title length should be at least 10 characters"],
    },
    topic: {
      type: String,
      required: true,
      min: [3, "topic length should be at least 10 characters"],
    },
    body: {
      type: String,
      required: true,
      min: [100, "body length should be at least 100 characters"],
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comments: {
      type: Array<CommentType>,
    },
  },
  {
    timestamps: true,
  }
);

export const BlogModel = mongoose.model("Blog", blogSchema);
