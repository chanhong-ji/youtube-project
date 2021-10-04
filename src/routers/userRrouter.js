import express from "express";
import {
  see,
  logout,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get(`/:id`, see);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
