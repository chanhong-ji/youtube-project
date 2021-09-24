import "./db";
import "./model/Video";
import app from "./server";

const PORT = 8000;

const onListening = () =>
  console.log(`✅ Server has opened on ${PORT} port💫💨.`);

app.listen(PORT, onListening);
