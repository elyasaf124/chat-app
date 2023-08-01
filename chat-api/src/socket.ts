import { Server as SocketIo } from "socket.io";
import { AppError } from "./utilitis/appError";
import { v4 as uuidv4 } from "uuid";
import { webOrigin } from "./webOrigin";

let users: any = [];

const addUser = (userId: any, socketId: any) => {
  !users.some((user: any) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: any) => {
  users = users.filter((user: any) => user.socketId !== socketId);
};

const getUser = (userId: any) => {
  return users.find((user: any) => {
    return user.userId === userId;
  });
};

export const socketFunctionality = (server: any) => {
  console.log(webOrigin);
  const io = new SocketIo(server, {
    cors: {
      origin: "https://chat-cli.onrender.com",
      // origin: ["http://localhost:3001", "https://chat-cli.onrender.com"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected.");

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", async (data) => {
      console.log("send");
      console.log(data);
      try {
        const user = await getUser(data.recivedMsgId);
        console.log(user.socketId);
        if (!user) throw new AppError("cant find user please try again", 400);
        io.to(user.socketId).emit("getMessage", {
          userSenderId: data.userSenderId,
          recivedMsgId: data.recivedMsg,
          contentMsg: data.contentMsg,
          chatId: data.chatId,
          author: data.author,
          type: data.type,
          read: -1,
          _id: uuidv4(),
        });
        console.log("get");
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};
