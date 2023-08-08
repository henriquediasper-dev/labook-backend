import express from "express";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { postRouter } from "./postRouter";

export const userRouter = express.Router();

const userController = new UserController(
  new UserBusiness(new UserDatabase(), new IdGenerator())
);

postRouter.post("/signup", userController.signup);
postRouter.post("/login", userController.login);
