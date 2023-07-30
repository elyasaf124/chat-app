import { NextFunction, Response } from "express";
import { Messages } from "../models/messagesSchame";
import { Chat } from "../models/chatShcame";
import mongoose from "mongoose";
import { User } from "../models/userShcame";

export const sendMsg = async (req: any, res: Response, next: NextFunction) => {
  try {
    //איש קשר
    const userContactId = new mongoose.Types.ObjectId(req.params.id);
    let arr = [];
    arr.push(userContactId);
    arr.push(req.user._id);

    const chat: any = await Chat.findById(req.body.msg.chat._id);
    console.log(2);
    console.log(chat);
    console.log(chat.active === false);

    if (chat.active === false) {
      if (!chat.activeFor.includes(req.user._id)) {
        chat.activeFor.push(req.user._id);
      }

      if (!chat.activeFor.includes(userContactId)) {
        chat.activeFor.push(userContactId);
      }

      console.log(3);
      const user = await User.findById(req.user._id);
      const userContact = await User.findById(userContactId);

      if (user) {
        console.log(4);
        const index = user.contact?.findIndex((ref: any) => {
          return ref.idRef._id.toString() === userContactId.toString();
        });

        if (user.contact && index !== -1) {
          console.log(5);
          user.contact[index as number].active = true;
          await user.save();
        }
      }
      if (userContact) {
        console.log(6);
        const index = userContact.contact?.findIndex((ref: any) => {
          return ref.idRef._id.toString() === req.user._id.toString();
        });

        if (userContact.contact && index !== -1) {
          console.log(7);
          userContact.contact[index as number].active = true;
          await userContact.save();
        } else if (index === -1 && user) {
          console.log(8);
          userContact?.contact?.push({
            idRef: req.user._id,
            active: true,
            userName: user.userName,
          });
          await userContact?.save();
          console.log(9);
        }
      }
      chat.active = true;
      chat.save();
      console.log(10);
    }
    console.log("run!!!");
    console.log(req.body);
    await Messages.create({
      userSenderId: req.user._id,
      contentMsg: req.body.msg.content,
      type: req.body.msg.type,
      recivedMsgId: req.body.msg.recivedMsgId,
      chatId: chat?._id,
    });
    console.log(11);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

export const setMessagesRead = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const chatId = req.params.chatId;
  const userContactId = req.params.userContactId;

  try {
    const msgs = await Messages.find({
      chatId: chatId,
      read: -1,
      userSenderId: userContactId,
    });

    if (msgs.length > 0) {
      await Promise.all(
        msgs.map(async (msg: any) => {
          msg.read = 1;
          await msg.save();
        })
      );
    }

    console.log("Messages updated successfully");
  } catch (error) {
    console.error(error);
  }
};

export const getMessagesByChatId = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    let pageSize: number = req.query.pageSize
      ? parseInt(req.query.pageSize)
      : 20;

    // Aggregate pipeline to count total and unread messages
    const aggregationPipeline = [
      {
        $match: { chatId: req.params.chatId },
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          totalUnreadMessages: {
            $sum: { $cond: [{ $eq: ["$read", -1] }, 1, 0] },
          },
        },
      },
    ];

    const [result] = await Messages.aggregate(aggregationPipeline);

    // Extract counts from the result or set default values if not available
    const totalMessages = result?.totalMessages || 0;
    const totalUnreadMessages = result?.totalUnreadMessages || 0;

    // Calculate the pageSize for the first page
    if (page === 1) {
      pageSize =
        totalUnreadMessages > pageSize ? totalUnreadMessages : pageSize;
    }

    // // Calculate the number of messages to skip based on the current page
    // const messagesToSkip = pageSize * (page - 1);
    const totalPages = Math.ceil(totalMessages / pageSize);
    const startIndex = Math.max(totalMessages - page * pageSize, 0);

    if (totalPages < page && totalMessages > 0) return;

    const limit = page === totalPages ? totalMessages % pageSize : pageSize;

    // Fetch the messages for the current page
    let messages;
    if (req.query.latestCreatedAt) {
      messages = await Messages.find({
        chatId: req.params.chatId,
        createdAt: { $lt: req.query.latestCreatedAt },
      })
        .sort({ createdAt: 1 }) // Sort in reverse chronological order (newest first)
        .skip(startIndex)
        .limit(limit);
    } else {
      messages = await Messages.find({ chatId: req.params.chatId })
        .sort({ createdAt: 1 }) // Sort in reverse chronological order (newest first)
        .skip(startIndex)
        .limit(limit);
    }

    res.status(200).json({
      status: "success",
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching messages.",
    });
  }
};
