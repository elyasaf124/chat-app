import "./chat.css";
import Add from "../../images/add.png";
import Messages from "../messages/Messages";
import InputMsg from "../inputMsg/InputMsg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  chatState,
  setLastMsg,
  setRenderChats,
} from "../../features/chatSlice";
import { v4 as uuidv4 } from "uuid";
import { AuthState, addUserModeActive } from "../../features/loginMoodSlice";
import { socket } from "../../socket";
import { cloudMsg } from "../../types/messagesType";
import { addNewMsg, updateChatsOrder } from "../../scripts/fetchIntialData";
import { useState } from "react";
import { baseUrl } from "../../main";

const Chat = () => {
  const dispatch = useDispatch();
  const chatUser = useSelector((state: chatState) => state.chat.chatUser);
  const currentUser = useSelector((state: AuthState) => state.auth.user);
  const currentChat = useSelector((state: chatState) => state.chat.currentChat);
  const [toggle, setToggle] = useState(false);

  const checkTypeMsg = async (msg: cloudMsg | string) => {
    if (typeof msg === "string") {
      return "text";
    }
    if (msg.type.startsWith("image")) {
      return "image";
    }
    if (msg.type.startsWith("audio")) {
      return "audio";
    }
    return "text";
  };
  const sendMsg = async (msg: string | cloudMsg) => {
    if (msg !== "") {
      const type = await checkTypeMsg(msg);
      const messageData: any = {
        recivedMsgId: chatUser[0].idRef._id,
        author: currentUser.userName,
        userSenderId: currentUser._id,
        contentMsg: msg,
        chatId: currentChat._id,
        type: type,
        _id: uuidv4(),
      };
      await axios.create({ withCredentials: true }).post(
        `
        ${baseUrl}/messages/sendMsg/${chatUser[0].idRef._id}`,
        {
          msg: {
            senderId: currentUser._id,
            recivedMsgId: chatUser[0].idRef._id,
            content: msg,
            chat: currentChat,
            type: type,
          },
        }
      );
      socket.emit("sendMessage", messageData);
      dispatch(setLastMsg(messageData));
      addNewMsg(messageData);
      updateChatsOrder(messageData);
      dispatch(setRenderChats());
      setToggle(!toggle);
    }
  };

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-top">
          <div className="chat-info">
            <img
              src={chatUser[0].idRef.img.secure_url}
              alt=""
              className="user-content-img"
            />
            <span>{chatUser[0].userName}</span>
          </div>
          <div className="chat-icons">
            <img
              onClick={() => dispatch(addUserModeActive())}
              src={Add}
              alt=""
            />
          </div>
        </div>
        <div className="box">
          <Messages setNewToggle={toggle} />
          <InputMsg sendMsg={sendMsg} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
