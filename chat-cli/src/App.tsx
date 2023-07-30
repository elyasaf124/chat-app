import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import AddUserContact from "./components/addUserContact/AddUserContact";
import { socket } from "./socket";
import { useDispatch } from "react-redux";
import {
  setLastMsg,
  setRenderChats,
  setRenderMessages,
  updateChatConversation,
} from "./features/chatSlice";

import {
  addNewChat,
  addNewMsg,
  checkExitsChat,
  fetchData,
  updateChatsOrder,
} from "./scripts/fetchIntialData";
import axios from "axios";
import { IMessage } from "./types/messagesType";
import { AuthState } from "./features/loginMoodSlice";

function App() {
  const isLoggedIn = useSelector((state: AuthState) => state.auth.isLoggedIn);
  const currentUserId = useSelector((state: AuthState) => state.auth.user._id);

  const dispatch = useDispatch();
  fetchData();

  useEffect(() => {
    if (!isLoggedIn) return;

    socket.connect();
    socket.emit("addUser", currentUserId);
    return () => {};
  }, [isLoggedIn]);

  useEffect(() => {
    socket.on("getMessage", async (msg: IMessage) => {
      const chatItemId: string | null = localStorage.getItem("chatId");
      let parsedChatId;
      if (chatItemId) {
        parsedChatId = JSON.parse(chatItemId);
      }
      const isExits = await validateChatExits(msg);
      if (isExits !== -1) {
        if (parsedChatId === msg.chatId) {
          const modifiedMsg = { ...msg, read: 1 };
          addNewMsg(modifiedMsg);
          dispatch(updateChatConversation(modifiedMsg));
          setRenderMessages();
          dispatch(setLastMsg(modifiedMsg));
          updateChatsOrder(modifiedMsg);
          dispatch(setRenderChats());

          return;
        } else {
          dispatch(updateChatConversation(msg));
          setRenderMessages();
          dispatch(setLastMsg(msg));
          addNewMsg(msg);
          updateChatsOrder(msg);
          dispatch(setRenderChats());

          return;
        }
      }
      await addNewChatLocal(msg);
      dispatch(setRenderChats());
    });
  }, [socket]);

  const addNewChatLocal = async (msg: IMessage) => {
    const chat = await getChatById(msg);
    await addNewChat(msg, chat);
  };

  const validateChatExits = async (msg: IMessage) => {
    const isExits = await checkExitsChat(msg);
    return isExits;
  };

  const getChatById = async (msg: IMessage) => {
    try {
      const response = await axios
        .create({ withCredentials: true })
        .get(`http://localhost:3000/chats/getChatById/${msg.chatId}`);
      return response.data.chat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/addUserContact" element={<AddUserContact />} />
        <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isLoggedIn ? <Home /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
