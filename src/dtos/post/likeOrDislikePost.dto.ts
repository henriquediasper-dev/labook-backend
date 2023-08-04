import z from "zod";

export interface LikeOrDislikePostInputDTO {
  idToLikeOrDislike: string;
  token: string;
  like: boolean;
}

export type LikeOrDislikePostsOutputDTO = undefined;

export const LikeOrDislikePostsSchema = z
  .object({
    idToLikeOrDislike: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean(),
  })
  .transform((data) => data as LikeOrDislikePostInputDTO);
