import axios, { AxiosResponse } from "axios";
import { IMessage } from "../types/messagesType";
import { cloneDeep } from "lodash";
import { IData } from "../types/dataTypes";
import { IChat } from "../types/chatTypes";
import { baseUrl } from "../main";

export let data: IData[];
export const fetchData = async () => {
  const res: AxiosResponse<IData[]> = await axios
    .create({ withCredentials: true })
    .get(`${baseUrl}/user/getData`);
  console.log(res.data);
  data = res.data;
  data = await sortData(data);
  return data;
};

const sortData = (data: IData[]) => {
  data.sort((a: any, b: any) => {
    const lastMsgA = a.chatMsgs[a.chatMsgs.length - 1];
    const lastMsgB = b.chatMsgs[b.chatMsgs.length - 1];

    if (lastMsgA?.createdAt > lastMsgB?.createdAt) {
      return -1; // b should come before a (latest messages first)
    } else if (lastMsgA?.createdAt < lastMsgB?.createdAt) {
      return 1; // a should come before b (latest messages first)
    } else {
      return 0; // no change in order
    }
  });
  return data;
};

export const addNewMsg = async (newMsg: IMessage) => {
  const index = data.findIndex((chat: IData) => {
    return chat.chat._id === newMsg.chatId;
  });
  if (index === -1) {
    if (data[index].chat.active === false) {
      data[index].chat.active = true;
    }
    return;
  }
  let deepCopyArr = cloneDeep(data[index].chat);
  if (data[index].chat.activeFor.length === 0) {
    deepCopyArr.activeFor = deepCopyArr.members;
  }

  if (data[index].chat.activeFor.length === 1) {
    deepCopyArr.activeFor = deepCopyArr.members;
  }
  data[index].chat = deepCopyArr;

  data[index].chatMsgs.push(newMsg);
  return;
};

export const logPreviosMsgs = (msg: IMessage[]) => {
  const index = data.findIndex((chat: IData) => {
    return chat.chat._id === msg[0].chatId;
  });
  if (index === -1) return;
  return data[index].chatMsgs.unshift(...msg);
};

export const updateDataMsgsAsRead = (chatId: string) => {
  const index = data.findIndex((chat: any) => chat.chat._id === chatId);
  if (index === -1) return;
  data[index].chatMsgs = data[index].chatMsgs.map((msg: IMessage) => {
    return { ...msg, read: 1 }; // Create a new object with the updated 'read' property
  });
};

export const addNewChat = (msg: IMessage, chat: IChat) => {
  const userObj: IData = {
    chat,
    chatMsgs: [msg],
  };

  data.push(userObj);
  updateChatsOrder(msg);
  return "success";
};

export const checkExitsChat = (msg: IMessage) => {
  const isExits = data.findIndex((chat: IData) => {
    return chat.chat._id === msg.chatId;
  });
  return isExits;
};

export const updateChatsOrder = (msg: IMessage) => {
  const index = data.findIndex((chat: IData) => {
    return chat.chat._id === msg.chatId;
  });
  if (index === 0) return;
  const toTop = data.splice(index, 1);
  data.unshift(toTop[0]);
};

export const deleteChatFunction = (chatId: string) => {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].chat._id === chatId) {
      data.splice(i, 1);
    }
  }
};
