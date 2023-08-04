import z from "zod";
import { PostModel } from "../../models/posts";

export interface GetPostInputDTO {
  token: string;
}

export type EditPostOutputDTO = PostModel[];

export const CreatePostSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetPostInputDTO);
