import express from "express";

export const userRouter = express.Router();

const userController = new UserController(new UserBusiness(new UserDatabase()));

postRouter.post("/signup", userControllerr.getPosts);
postRouter.post("/login", userController.postPost);
