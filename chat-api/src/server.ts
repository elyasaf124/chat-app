import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { socketFunctionality } from "./socket";

dotenv.config({ path: "./.env" });

export const server = http.createServer(app);
socketFunctionality(server);
console.log(process.env.DATABASE);
const DB = process.env.DATABASE as string;
console.log(DB);

mongoose
  .connect(DB)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err: Error) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit();
  });

const port = 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
