import { useSelector } from "react-redux";
import { IMessage } from "../../types/messagesType";
import { format } from "timeago.js";
import "./message.css";
import AudioPlayer from "../audioPlayer/AudioPlayer";
import { AuthState } from "../../features/loginMoodSlice";
import { chatState } from "../../features/chatSlice";

const Message = (msg: IMessage) => {
  const currentUser = useSelector((state: AuthState) => state.auth.user);
  const chatUser = useSelector((state: chatState) => state.chat.chatUser);

  const currentUserImg = currentUser?.img.secure_url;
  const chatUserImg = chatUser[0]?.idRef?.img.secure_url;

  const checkTypeMsg = (msg: IMessage) => {
    if (typeof msg.contentMsg === "string") {
      return <p>{msg.contentMsg}</p>;
    } else if (msg.contentMsg?.type === "audio") {
      return <AudioPlayer key={msg._id} src={msg.contentMsg.secure_url} />;
    } else if (msg.contentMsg?.type === "image") {
      return <img className="chat-img" src={msg.contentMsg.secure_url} />;
    } else {
      return null;
    }
  };

  return (
    <div
      className={`message ${
        msg.userSenderId === currentUser._id ? "owner" : ""
      }`}
    >
      <div className="message-info">
        <img
          className="message-info-img"
          src={
            msg.userSenderId === currentUser?._id ? currentUserImg : chatUserImg
          }
          alt=""
        />
        <span>{format(msg.createdAt)}</span>
      </div>
      <div
        className={`message-content ${
          msg.userSenderId === currentUser._id ? "owner" : ""
        }`}
      >
        {checkTypeMsg(msg)}
      </div>
    </div>
  );
};

export default Message;
