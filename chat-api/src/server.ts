import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { socketFunctionality } from "./socket";

export const server = http.createServer(app);
socketFunctionality(server);

const DB = process.env.DATABASE as string;

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
