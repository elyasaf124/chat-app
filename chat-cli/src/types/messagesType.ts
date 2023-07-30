export interface IMessage {
  _id: string;
  chatId: string;
  contentMsg:
    | string
    | {
        public_id: string;
        version: number;
        signature: string;
        secure_url: string;
        type: string;
      };
  createdAt: number;
  type: string;
  userSenderId: string;
  read?: Number;
}

export interface cloudMsg {
  public_id: string;
  version: number;
  signature: string;
  secure_url: string;
  type: string;
}

export interface IContentMsg {
  contentMsg:
    | string
    | {
        public_id: string;
        version: number;
        signature: string;
        secure_url: string;
        type: string;
      };
}
