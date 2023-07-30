import express from "express";
import {
  findChat,
  findChat2,
  getAllChats,
  getChatById,
} from "../controllers/chatController";
import { protect } from "../controllers/authController";

export const router = express.Router();

router.route("/findChat/:ids").get(protect, findChat);
router.route("/findChat222").get(protect, findChat2);
router.route("/getAllChats").get(protect, getAllChats);
router.route("/getChatById/:chatId").get(protect, getChatById);
