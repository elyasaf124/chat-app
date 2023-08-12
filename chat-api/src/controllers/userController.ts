import { Request, Response, NextFunction } from "express";
import { User } from "../models/userShcame";
import { AppError } from "../utilitis/appError";
import mongoose from "mongoose";
import { Chat } from "../models/chatShcame";
import { Messages } from "../models/messagesSchame";

interface IUser {
  id?: String;
  userName: String;
}

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

export const createUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

export const addUserContactById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let BodyId = new mongoose.Types.ObjectId(req.body.idRef);
    const user = req.user;

    const userExists = user.content.find((userRef: any) => {
      return userRef.idRef.equals(BodyId);
    });

    if (userExists) {
      throw new AppError("This user already exists in your content", 400);
    }

    user.content.push(req.body, { active: false });

    BodyId = new mongoose.Types.ObjectId(BodyId);
    let arr = [];
    arr.push(BodyId);
    arr.push(req.user._id);

    await user.save();

    const chat = await Chat.find({ members: { $all: arr } });

    if (chat.length === 0) {
      await Chat.create({ members: [user._id, BodyId] });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const addUserContact = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userContact: any = await User.find({ email: req.body.email });
    const user = req.user;

    const userExists = user.contact.find((userRef: any) => {
      return userRef.idRef.equals(userContact[0]._id);
    });

    if (userExists) {
      throw new AppError("This user already exists in your content", 400);
    }

    user.contact.push({
      idRef: userContact[0]._id,
      userName: req.body.userName,
      active: false,
    });

    await user.save();

    let arr = [];
    arr.push(userContact[0]._id);
    arr.push(req.user._id);

    const chat = await Chat.find({ members: { $all: arr } });

    if (chat.length === 0) {
      await Chat.create({ members: [user._id, userContact[0]._id] });
    }
    const chatContact = user.contact[user.contact.length - 1];
    chatContact.idRef = userContact[0];
    const userContactChat = [
      {
        chat: chatContact,
      },
    ];
    res.status(200).json({
      status: "success",
      userContactChat,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllUsersContact = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let contact;
    const users = await User.findById(req.user._id).populate("contact.idRef");
    if (users) contact = users.contact;

    res.status(200).json({
      status: "success",
      contact,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

export const searchUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName } = req.params;

    let users: IUser[] = [];

    const myUser = await User.findById(req.user._id).populate("contact.idRef");
    const foundUser = myUser?.contact?.find((user: IUser) => {
      return user.userName === userName;
    });

    if (!foundUser)
      throw new AppError("There is no user that matches your request.", 400);

    users.push(foundUser);

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllUsers = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    if (!users) throw new AppError("no users", 400);

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getData = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log("req.user._id", req.user._id);
    const chats = await Chat.find({ activeFor: { $in: req.user._id } });

    // Fetch last 20 messages for each chat
    const chatsWithLast20Msgs = await Promise.all(
      chats.map(async (chat) => {
        const chatMsgs = await Messages.find({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .limit(20)
          .exec();
        chatMsgs.reverse();
        return { chat, chatMsgs };
      })
    );
    res.json(chatsWithLast20Msgs);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteContact = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.body.chatId },
      {
        $pull: { activeFor: req.user._id },
        active: false, // This sets the 'active' field to false in the document
      },
      { new: true } // This option returns the updated document
    );
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { contact: { idRef: req.body.contactId } } },
      { new: true }
    );
    if (!updatedChat) throw new AppError("Chat not found", 400);

    res.status(200).json({
      status: "success",
      user,
      updatedChat,
    });
  } catch (error) {
    console.log(error);
  }
};
