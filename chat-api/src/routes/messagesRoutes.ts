import express from "express";
import {
  getMessagesByChatId,
  sendMsg,
  setMessagesRead,
} from "../controllers/messagesController";
import { protect } from "../controllers/authController";

export const router = express.Router();

router.route("/sendMsg/:id").post(protect, sendMsg);
router.route("/getMessagesByChatId/:chatId").get(protect, getMessagesByChatId);
router
  .route("/setMessagesRead/:chatId/:userContactId")
  .patch(protect, setMessagesRead);
