import express from "express";
import {
  see,
  logout,
  edit,
  remove,
  startGithubLogin,
  finishGithubLogin,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get(`/:id`, see);
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
