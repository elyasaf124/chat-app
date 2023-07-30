import { IChat } from "./chatTypes";
import { IMessage } from "./messagesType";

export interface IData {
  chat: IChat;
  chatMsgs: Array<IMessage>;
}
