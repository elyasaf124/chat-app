import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Message from "../message/Message";
import { IMessage } from "../../types/messagesType";
import {
  data,
  logPreviosMsgs,
  updateDataMsgsAsRead,
} from "../../scripts/fetchIntialData";
import { AuthState } from "../../features/loginMoodSlice";
import { chatState } from "../../features/chatSlice";
import { IData } from "../../types/dataTypes";
import axios from "axios";
import "./messages.css";
import { baseUrl } from "../../main";

const Messages = ({ setNewToggle }: any) => {
  const CurrentUser = useSelector((state: AuthState) => state.auth.user);
  const chatUser = useSelector((state: chatState) => state.chat.chatUser);
  const chatConversation = useSelector(
    (state: chatState) => state.chat.chatConversation
  );
  const currentChat = useSelector((state: chatState) => state.chat.currentChat);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [pageNumber, setPageNumber] = useState(2);
  const [heightContainer, setHeightContainer] = useState(100);
  const [atBottom, setAtBottom] = useState(false);
  const isFirstRender = useRef(true);
  const [allowFetchData, setAllowFetchData] = useState(false);
  const [unReadCountIndex, setUnReadCountIndex] = useState(-1);
  const [unReadCount, setUnReadCount] = useState<number | null>(null);
  const [toggle, setToggle] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    try {
      const count = async () => {
        const filter = await filterDataChat(data);
        setMessages(filter[0].chatMsgs);
        const unReadCount = await countMsgsUnRead(filter[0].chatMsgs);
        setUnReadCount(unReadCount);
      };
      count();
    } catch (error) {
      console.log(error);
    }
  }, [currentChat, chatConversation]);
  // }, [currentChat, toggle, setNewToggle, chatConversation]);

  const filterDataChat = (data: IData[]) => {
    const filterData = data.filter((chat: IData) => {
      return chat.chat._id === currentChat._id;
    });
    return filterData;
  };

  const countMsgsUnRead = (messages: IMessage[]) => {
    const unReadCount = messages.filter((msg: IMessage) => {
      return msg.read === -1 && msg.userSenderId === chatUser[0]?.idRef._id;
    }).length;
    return unReadCount;
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const scrollTop = chatContainerRef.current.scrollTop;
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const clientHeight = chatContainerRef.current.clientHeight;

      if (scrollTop === 0 && scrollHeight > clientHeight) {
        setHeightContainer(scrollHeight);
        setAllowFetchData(true);
        logPreviousMsgs();
        return;
      }

      if (scrollTop === scrollHeight - clientHeight) {
        setAtBottom(true);
        return;
      }
      setAtBottom(false);
      setAllowFetchData(false);
    }
  };

  const logPreviousMsgs = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/messages/getMessagesByChatId/${currentChat._id}?page=${pageNumber}&latestCreatedAt=${messages[0].createdAt}`,
        { withCredentials: true }
      );
      logPreviosMsgs(res.data.messages);
      setMessages((prev: IMessage[]) => [...res.data.messages, prev]);
      setToggle(!toggle);
      setUnReadCount(null);
      setUnReadCountIndex(-1);
      if (res.data.status === "success") setPageNumber(pageNumber + 1);
    } catch (error: any) {
      if (error.response?.data.status === "fail") {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      let index;
      let count;
      if (isFirstRender.current) {
        index = messages?.findIndex((msg: IMessage) => {
          return msg.read === -1 && msg.userSenderId !== CurrentUser._id;
        });

        if (index !== -1 && isFirstRender.current) {
          count = messages?.reduce(
            //@ts-ignore
            (
              accumulator: number,
              msg: { read: number; userSenderId: string }
            ) => {
              if (msg.read === -1 && msg.userSenderId !== CurrentUser._id) {
                return accumulator + 1;
              }
              return accumulator;
            },
            0
          );
          const unreadCountV = index > -1 ? index : ""; //index msg
          const unreadCount: any = index > -1 ? count : ""; //count msgs
          if (unreadCountV) setUnReadCountIndex(unreadCountV);
          if (unreadCount) setUnReadCount(unreadCount);
          const element =
            chatContainerRef.current &&
            (chatContainerRef.current.children[index] as HTMLDivElement);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            index = -1;
          }
          index = -1;
          isFirstRender.current = false;
          return;
        }
      }
      if (chatContainerRef.current && index === -1 && isFirstRender.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        isFirstRender.current = false;
        setUnReadCount(null);

        return;
      }
      if (
        chatContainerRef.current &&
        atBottom &&
        !isFirstRender.current &&
        !allowFetchData
      ) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        isFirstRender.current = false;
        setUnReadCount(null);
      }
      if (
        chatContainerRef.current &&
        !atBottom &&
        !isFirstRender.current &&
        !allowFetchData
      ) {
        isFirstRender.current = false;
        setUnReadCount(null);

        return;
      }
      if (allowFetchData && chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight - heightContainer;
        isFirstRender.current = false;
        setUnReadCount(null);

        return;
      }
      if (!isFirstRender.current) {
        setUnReadCount(null);
      }
    }
  }, [messages, chatConversation, setNewToggle]);

  useEffect(() => {
    isFirstRender.current = true;
    return () => {
      isFirstRender.current = true;
      setPageNumber(2);
      updateMsgsAsRead();
      updateDataMsgsAsRead(currentChat._id);
    };
  }, [currentChat, chatUser]);

  const updateMsgsAsRead = async () => {
    await axios
      .patch(
        `${baseUrl}/messages/setMessagesRead/${currentChat._id}/${chatUser[0]?.idRef._id}`
      )
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <div className="messages">
      <div
        onScroll={handleScroll}
        ref={chatContainerRef}
        className="message-container"
      >
        {messages.length > 0 &&
          messages?.map((msg: IMessage, index: number) => {
            if (unReadCountIndex === index) {
              return (
                <>
                  {unReadCount !== 0 && unReadCount !== null ? (
                    <div key={msg._id}>
                      <div className="un-read-container">
                        <span className="un-read-msg">
                          Unread {unReadCount} Messages
                        </span>
                      </div>
                      <div>
                        <Message {...msg} />
                      </div>
                    </div>
                  ) : null}
                </>
              );
            } else {
              return <Message {...msg} key={msg._id} />;
            }
          })}
      </div>
    </div>
  );
};

export default Messages;
