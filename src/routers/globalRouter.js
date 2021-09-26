import express from "express";
import { home, search } from "../controller/videoController";
import { join, login } from "../controller/userController";

const globalRouter = express.Router("/");

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
