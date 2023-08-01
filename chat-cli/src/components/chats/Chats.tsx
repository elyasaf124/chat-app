import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePicture, AiOutlineAudio } from "react-icons/ai";
import { useEffect, useState } from "react";
import { setSearchUnActive } from "../../features/searchSlice";
import {
  activeChat,
  chatState,
  closeChat,
  handleChat,
  handleChatUser,
  setRenderChats,
} from "../../features/chatSlice";
import { deleteChatFunction } from "../../scripts/fetchIntialData";
import { IData } from "../../types/dataTypes";
import { IRefUser } from "../../types/userTypes";
import { IMessage } from "../../types/messagesType";
import axios from "axios";
import "./chats.css";
import { baseUrl } from "../../main";

const Chats = ({ chat, contacts }: { chat: IData; contacts: IRefUser[] }) => {
  const dispatch = useDispatch();
  const currentChat = useSelector((state: chatState) => state.chat.currentChat);
  const lastMsgGlobal = useSelector((state: chatState) => state.chat.lastMsg);
  const chatActive = useSelector((state: chatState) => state.chat.chatActive);

  const [userContactDetails, setUserContactDetails] = useState<IRefUser[]>([]);
  const [countUnReadMsg, setCountUnReadMsg] = useState<number>(0);
  const [openDeleteBtn, setOpenDeleteBtn] = useState(false);
  const [lastMsg, setLastMsg] = useState<IMessage>();

  useEffect(() => {
    const userDetails: Array<IRefUser> = contacts?.filter(
      (contact: IRefUser) => {
        return chat.chat.members.includes(contact.idRef._id);
      }
    );
    setUserContactDetails(userDetails);
  }, [currentChat, contacts]);

  useEffect(() => {
    if (!lastMsgGlobal._id) return;
    if (lastMsgGlobal.chatId === chat.chat._id) {
      setLastMsg(lastMsgGlobal);
    }
  }, [lastMsgGlobal]);

  useEffect(() => {
    setLastMsg(chat.chatMsgs[chat.chatMsgs.length - 1]);
    if (currentChat?._id === lastMsg?.chatId) return;
    const count = async () => {
      const unReadCount = await countMsgsUnRead(chat.chatMsgs);
      setCountUnReadMsg(unReadCount);
    };
    count();
  }, [lastMsg]);

  const countMsgsUnRead = (messages: IMessage[]) => {
    const unReadCount = messages.filter((msg: IMessage) => {
      return (
        msg.read === -1 && msg.userSenderId === userContactDetails[0]?.idRef._id
      );
    }).length;
    return unReadCount;
  };

  const playChat = () => {
    dispatch(handleChatUser(userContactDetails));
    dispatch(handleChat(chat.chat));
    dispatch(activeChat());
    dispatch(setSearchUnActive());
    setCountUnReadMsg(0);
    localStorage.setItem("chatId", JSON.stringify(chat.chat._id));
  };

  useEffect(() => {
    if (!chatActive) localStorage.removeItem("chatId");
  }, [chatActive]);

  const deleteContact = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    axios
      .create({ withCredentials: true })
      .patch(`${baseUrl}/user/deleteContact`, {
        chatId: chat.chat._id,
        contactId: userContactDetails[0]?.idRef._id,
      })
      .then(async (res: any) => {
        if (res.data.status === "success") {
          await deleteChatFunction(chat.chat._id);
          dispatch(setRenderChats());
          dispatch(closeChat());
        }
      });
  };

  const checkTypeMsg = (msg: any): React.ReactNode => {
    switch (msg?.type) {
      case "audio":
        return (
          <div
            className="img-msg-container
          "
          >
            <AiOutlineAudio size="24px" />
            <span>voice msg</span>
          </div>
        );

      case "image":
        return (
          <div className="img-msg-container">
            <AiOutlinePicture size="24px" />
            <span>image</span>
          </div>
        );

      case "text":
      case "string":
        return msg.contentMsg;
    }
  };

  return (
    <div className="chats" onClick={playChat}>
      <div className="chats-container">
        <img
          src={userContactDetails[0]?.idRef.img.secure_url}
          className="chats-img"
        />
        <div className="user-container">
          <span className="chats-name">{userContactDetails[0]?.userName}</span>
          <span className="chats-last-msg">{checkTypeMsg(lastMsg)}</span>
        </div>
        <div
          className={
            countUnReadMsg === 0 ? "none" : "count-msg-unread-container"
          }
        >
          <div className="count-msg-unread">{countUnReadMsg}</div>
        </div>
        <div
          className="delete-user-container"
          onMouseEnter={() => setOpenDeleteBtn(true)}
          onMouseLeave={() => setOpenDeleteBtn(false)}
        >
          <span className="delete-user">.</span>
          <span className="delete-user">.</span>
          <span className="delete-user">.</span>
          {openDeleteBtn && (
            <div className="delete-btn-container">
              <button onClick={(e) => deleteContact(e)} className="delete-btn">
                delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
