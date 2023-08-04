import express from "express";

export const postRouter = express.Router();

const postController = new PostController(new PostBusiness(new PostDatabase()));

postRouter.get("/", postController.getPosts);
postRouter.post("/", postController.postPost);
postRouter.put("/:id", postController.putPost);
postRouter.delete("/:id", postController.deletePosts);

postRouter.put("/:id/like", postController.likeOrDislikePost);
