import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalrouter";
import userRouter from "./routers/userRrouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const PORT = 5000;

app.set("views", process.cwd() + "/src/views/");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.use(morgan("common"));

const onListening = () => console.log(`Server has opened on ${PORT} port💫💨.`);

app.listen(PORT, onListening);
