import mongoose from "mongoose";

const ChatSchame = new mongoose.Schema({
  members: Array,
  createdAt: {
    type: Number,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: false,
  },
  activeFor: Array,
});

export const Chat = mongoose.model("Chat", ChatSchame);
