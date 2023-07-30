export interface Iuser {
  _id: string;
  contact?: IuserContact[];
  createdAt: number;
  email: string;
  img: {
    public_id: string;
    secure_url: string;
    signature: string;
    version: number;
  };
  role: string;
  userName: string;
}

export interface IuserContact {
  idRef: string;
  userName: string;
  _id: string;
}

export interface IuserRegister {
  userName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  role?: string;
  img?: {
    name: string;
    lastModified: number;
    webkitRelativePath: string;
    size: number;
    type: string;
  };
}

export interface searchUser {
  _id: string;
  idRef: Iuser;
  email: string;
  userName: string;
}

export interface UserRef {
  _id: string;
  userName: string;
  email: string;
}

export interface IuserContactList {
  chatMsgs: {
    _id: string;
    chadId: string;
    contentMsg:
      | string
      | {
          public_id: string;
          version: number;
          signature: string;
          secure_url: string;
          type: string;
        };
    read: number;
    type: string;
    userSenderId: string;
  };
  userContact: {
    _id: string;
    role: string;
    userName: string;
    active: boolean;
    idRef: {
      _id: string;
      createdAt: number;
      email: string;
      img: {
        public_id: string;
        secure_url: string;
        signature: string;
        version: number;
        type: string;
      };
      contact: [
        { _id: string; active: boolean; idRef: string; userName: string }
      ];
    };
  };
}

export interface IUserContact {
  _id: string;
  role: string;
  userName: string;
  active: boolean;
  idRef: {
    _id: string;
    createdAt: number;
    email: string;
    img: {
      public_id: string;
      secure_url: string;
      signature: string;
      version: number;
      type: string;
    };
    contact: [
      { _id: string; active: boolean; idRef: string; userName: string }
    ];
  };
}

export interface IContact {
  _id: string;
  active: boolean;
  idRef: string;
  userName: string;
}

export interface IRefUser {
  _id: string;
  userName: string;
  active: boolean;
  idRef: Iuser;
}
