import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AuthState, setUserContactChat } from "../../features/loginMoodSlice";
import { chatState } from "../../features/chatSlice";
import { data } from "../../scripts/fetchIntialData";
import { IData } from "../../types/dataTypes";
import NavBar from "../navBar/NavBar";
import Search from "../search/Search";
import Chats from "../chats/Chats";
import axios from "axios";
import "./sideBar.css";
import { baseUrl } from "../../main";

const SideBar = () => {
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchActive = useSelector((state: any) => state.search.searchActive);
  const searchUsers = useSelector((state: any) => state.search.searchUsers);
  const renderChats = useSelector((state: chatState) => state.chat.renderChats);
  const userId = useSelector((state: AuthState) => state.auth.user._id);

  useEffect(() => {
    fetchContacts().then(() => {
      setIsLoading(false);
    });
  }, [renderChats]);

  const fetchContacts = async () => {
    if (!data) return;
    if (contacts.length > 0) return;
    axios
      .create({ withCredentials: true })
      .get(`${baseUrl}/user/getAllUsersContact`)
      .then((res) => {
        setContacts(res.data.contact);
        dispatch(setUserContactChat(res.data.contact));
      });
  };

  const getUsers = () => {
    if (searchActive) {
      return searchUsers.map((chat: IData) => {
        return <Chats chat={chat} contacts={contacts} key={chat.chat._id} />;
      });
    } else {
      return data?.map((chat: IData) => {
        if (chat.chat?.activeFor.includes(userId)) {
          return <Chats chat={chat} contacts={contacts} key={chat.chat._id} />;
        } else return;
      });
    }
  };

  return (
    <div className="side-bar">
      <NavBar />
      <Search />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        data?.length > 0 && <div className="chats-box"> {getUsers()}</div>
      )}
    </div>
  );
};

export default SideBar;
