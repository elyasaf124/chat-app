import { NextFunction, Response } from "express";
import { Chat } from "../models/chatShcame";
import { Messages } from "../models/messagesSchame";
import { AppError } from "../utilitis/appError";
import mongoose from "mongoose";
import { User } from "../models/userShcame";

export const findChat = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;

    const idsArray = [req.params.ids, req.user._id];
    const ids = idsArray.map((id: string) => new mongoose.Types.ObjectId(id));

    const chat = await Chat.find({ members: { $all: ids } });

    if (chat.length === 0) {
      throw new AppError("chat not found", 400);
    }

    const totalMessages = await Messages.countDocuments({
      chatId: chat[0]._id,
    });
    const totalPages = Math.ceil(totalMessages / pageSize);
    const startIndex = Math.max(totalMessages - page * pageSize, 0);

    if (totalPages < page && totalMessages > 0) return;

    const limit = page === totalPages ? totalMessages % pageSize : pageSize;

    let chatMsgs;
    if (req.query.latestCreatedAt) {
      chatMsgs = await Messages.find({
        chatId: chat[0]._id,
        createdAt: { $lt: req.query.latestCreatedAt },
      })
        .sort({ createdAt: 1 }) // Sort in ascending order by createdAt
        .skip(startIndex)
        .limit(limit);
    } else {
      chatMsgs = await Messages.find({
        chatId: chat[0]._id,
      })
        .sort({ createdAt: 1 }) // Sort in ascending order by createdAt
        .skip(startIndex)
        .limit(limit);
    }

    res.status(200).json({
      status: "success",
      chatMsgs,
      chat,
    });
  } catch (error) {
    next(error);
  }
};

export const findChat2 = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let usersContact: any;
    const users = await User.findById(req.user._id).populate("contact.idRef");
    if (users) usersContact = users.contact;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;

    const ids = usersContact.map(
      (user: any) => new mongoose.Types.ObjectId(user.idRef.id)
    );

    const chatPromises = ids.map(async (id: any) => {
      return Chat.find({ members: { $all: [id, req.user._id] } });
    });

    const chatResults = await Promise.all(chatPromises);
    const chats = chatResults.flat();

    const data = chats.map(async (chat: any) => {
      // const chat = await Chat.find({ members: { $all: ids } });
      if (chat.length === 0) {
        throw new AppError("chat not found", 400);
      }

      const totalMessages = await Messages.countDocuments({
        chatId: chat._id,
      });
      const totalPages = Math.ceil(totalMessages / pageSize);
      const startIndex = Math.max(totalMessages - page * pageSize, 0);

      if (totalPages < page && totalMessages > 0) return;

      const limit = page === totalPages ? totalMessages % pageSize : pageSize;

      let chatMsgs;
      if (req.query.latestCreatedAt) {
        chatMsgs = await Messages.find({
          chatId: chat._id,
          createdAt: { $lt: req.query.latestCreatedAt },
        })
          .sort({ createdAt: 1 }) // Sort in ascending order by createdAt
          .skip(startIndex)
          .limit(limit);
      } else {
        return (chatMsgs = await Messages.find({
          chatId: chat._id,
        })
          .sort({ createdAt: 1 }) // Sort in ascending order by createdAt
          .skip(startIndex)
          .limit(limit));
      }
      return chatMsgs;
    });
    let data2 = await Promise.all(data);
    const mergedData = data2.map((chatMsgs: any, index: number) => {
      const userContact = usersContact[index];
      return {
        userContact,
        chatMsgs,
      };
    });


    res.status(200).json({
      status: "success",
      mergedData,
      // chatMsgs,
      // chat,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllChats = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const chats = await Chat.find({ members: { $in: [req.user._id] } });

    res.status(200).json({
      status: "success",
      chats,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getChatById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
   

    res.status(200).json({
      status: "success",
      chat,
    });
  } catch (error) {
    console.log(error);
  }
};
