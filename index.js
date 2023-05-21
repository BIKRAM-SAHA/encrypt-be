import express from "express";
import { decryptImage, encryptImage } from "./controllers/imageControllers.js";
import bodyParser from "body-parser";
import cors from "cors";

const PORT = 5000;
// instance of express app
const app = express();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.post("/encryptImages", encryptImage);
app.post("/decryptImages", decryptImage);

//listen for request
//returns an instance of server
const server = app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

server.setTimeout(500000)