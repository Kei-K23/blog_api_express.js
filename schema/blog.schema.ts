import { TypeOf, z } from "zod";

export const CreateBlogSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "title is required!",
      })
      .min(10, "title length should be at least 10 characters"),

    sub_title: z
      .string({
        required_error: "sub title is required!",
      })
      .min(5, "sub title length should be at least 10 characters")
      .optional(),

    topic: z
      .string({
        required_error: "topic is required!",
      })
      .min(3, "topic length should be at least 10 characters"),
    body: z
      .string({
        required_error: "topic is required!",
      })
      .min(100, "body length should be at least 100 characters"),
  }),
  params: z.object({
    user_id: z.string({
      required_error: "user id is required!",
    }),
  }),
});

export const CreateUpdateBlogSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "title is required!",
      })
      .min(10, "title length should be at least 10 characters")
      .optional(),
    sub_title: z
      .string({
        required_error: "sub title is required!",
      })
      .min(5, "sub title length should be at least 10 characters")
      .optional(),

    topic: z
      .string({
        required_error: "topic is required!",
      })
      .min(3, "topic length should be at least 10 characters")
      .optional(),
    body: z
      .string({
        required_error: "topic is required!",
      })
      .min(100, "body length should be at least 100 characters")
      .optional(),
  }),
  params: z.object({
    user_id: z.string({
      required_error: "user id is required!",
    }),
    blog_id: z.string({
      required_error: "blog id is required!",
    }),
  }),
});

export const CreateDeleteBlogSchema = z.object({
  params: z.object({
    user_id: z.string({
      required_error: "user id is required!",
    }),
    blog_id: z.string({
      required_error: "blog id is required!",
    }),
  }),
});

export type CreateBlogAndUpdateProp = {
  body: string;
  title: string;
  topic: string;
  sub_title?: string | undefined;
  user_id: string;
};

export type CreateBlogInput = TypeOf<typeof CreateBlogSchema>;
export type CreateUpdateBlogInput = TypeOf<typeof CreateUpdateBlogSchema>;
export type CreateDeleteBlogInput = TypeOf<typeof CreateDeleteBlogSchema>;
