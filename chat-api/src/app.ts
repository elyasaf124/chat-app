import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import { router as userRouter } from "./routes/usersRoutes";
import { router as messagesRouter } from "./routes/messagesRoutes";
import { router as chatsRouter } from "./routes/chatsRoutes";

import { globalErrorHandlerNew } from "./utilitis/appError";

dotenv.config({ path: __dirname + `/.env` });

const app = express();
export default app;

export const corsOptions: any = {
  credentials: true,
  origin: [
    "http://localhost:3001",
    "http://localhost:3000/socket.io",
    "https://chat-cli.onrender.com",
    "https://chat-api-ckbb.onrender.com/socket.io",
    "https://chat-api-ckbb.onrender.com",
  ],
  optionsSuccessStatus: 200,
};

app.use(compression());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/messages", messagesRouter);
app.use("/chats", chatsRouter);

app.use(globalErrorHandlerNew);
