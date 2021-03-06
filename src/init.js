import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./model/Video";
import "./model/User";
import "./model/Comment";
import app from "./server";

const PORT = process.env.PORT || 8000;

const onListening = () =>
  console.log(`✅ Server has opened on ${PORT} port💫💨.`);

app.listen(PORT, onListening);
