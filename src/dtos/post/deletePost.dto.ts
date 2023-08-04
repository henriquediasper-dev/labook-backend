import z from "zod";

export interface DeletePostInputDTO {
  idToDelete: string;
  token: string;
}

export type CreatePostOutputDTO = undefined;

export const CreatePostSchema = z
  .object({
    idToDelete: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as DeletePostInputDTO);
