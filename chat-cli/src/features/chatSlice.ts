import { createSlice } from "@reduxjs/toolkit";
import { Iuser } from "../types/userTypes";
import { IChat } from "../types/chatTypes";
import { IMessage } from "../types/messagesType";

export interface chatState {
  chat: any;
  chatUser: Iuser;
  currentChat: IChat;
  input: string;
  chatActive: boolean;
  chatConversation: IMessage[];
  lastMsg: IMessage;
  chatsList: IChat[];
  renderChats: boolean;
  renderMessages: boolean;
}

export const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    chatUser: <any>{},
    currentChat: <any>{},
    input: "",
    chatActive: false,
    chatConversation: <any>[],
    lastMsg: {},
    chatsList: [],
    renderChats: false,
    renderMessages: false,
  },
  reducers: {
    setRenderChats: (state) => {
      state.renderChats = !state.renderChats;
    },
    setRenderMessages: (state) => {
      state.renderMessages = !state.renderChats;
    },
    handleChatUser: (state, action) => {
      state.chatUser = action.payload;
    },
    handleChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setChatsList: (state, action) => {
      state.chatsList = action.payload;
    },

    activeChat: (state) => {
      state.chatActive = true;
    },

    closeChat: (state) => {
      state.chatActive = false;
    },
    handleInputChat: (state, action) => {
      state.input += action.payload;
    },
    handleChatConversation: (state, action) => {
      state.chatConversation = action.payload;
    },
    updateChatConversation: (state, action) => {
      if (state.currentChat._id === action.payload.chatId) {
        state.chatConversation.push(action.payload);
      } else return;
    },
    setLogPreviousMsgs: (state, action) => {
      state.chatConversation.unshift(...action.payload);
    },
    setUpdateChatOrderList: (state, action) => {
      const index = state.chatsList.findIndex((chat: IChat) => {
        return chat._id === action.payload.chatId;
      });
      if (index === -1) return;
      const toTop = state.chatsList.splice(index, 1);
      state.chatsList.unshift(toTop[0]);
    },
    setLastMsg: (state, action) => {
      state.lastMsg = action.payload;
    },
  },
});

export const {
  handleChat,
  handleChatUser,
  handleInputChat,
  handleChatConversation,
  updateChatConversation,
  closeChat,
  activeChat,
  setLastMsg,
  setLogPreviousMsgs,
  setUpdateChatOrderList,
  setRenderChats,
  setChatsList,
  setRenderMessages,
} = ChatSlice.actions;
export default ChatSlice.reducer;
