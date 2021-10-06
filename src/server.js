import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRrouter";
import videoRouter from "./routers/videoRouter";
import { localMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";

const app = express();

app.set("views", process.cwd() + "/src/views/");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads"));
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use(morgan("common"));

export default app;
