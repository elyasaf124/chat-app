import mongoose from "mongoose";

const messagesSchame = new mongoose.Schema({
  userSenderId: {
    required: [true, "message must belong to a user"],
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recivedMsg: {
    type: String,
  },
  read: {
    type: Number,
    default: -1,
  },
  userName: String,
  contentMsg: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  type: String,
  chatId: String,
});

export const Messages = mongoose.model("Messages", messagesSchame);
