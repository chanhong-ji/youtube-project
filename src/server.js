import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRrouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import flash from "express-flash";

const app = express();

app.set("views", process.cwd() + "/src/views/");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads"));
app.use(
  "/build",
  express.static("build"),
  express.static("node_modules/@ffmpeg/core/dist")
);
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
app.use(morgan("common"));

export default app;
