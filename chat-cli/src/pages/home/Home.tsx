import { useSelector } from "react-redux";
import Chat from "../../components/chat/Chat";
import SideBar from "../../components/sideBar/SideBar";
import "./home.css";
import AddUserContact from "../../components/addUserContact/AddUserContact";
import ChatUnActive from "../../components/chatUnActive/ChatUnActive";
import { chatState } from "../../features/chatSlice";
import { AuthState } from "../../features/loginMoodSlice";

const Home = () => {
  const chatActive = useSelector((state: chatState) => state.chat.chatActive);
  const searchActive = useSelector((state: any) => state.search.searchActive);
  const addUserMode = useSelector((state: AuthState) => state.auth.addUserMode);

  return (
    <div className="home">
      <div className="home-container">
        <SideBar />
        <div className="home-chat">
          {chatActive && !searchActive ? <Chat /> : <ChatUnActive />}
        </div>
      </div>
      {addUserMode ? <AddUserContact /> : null}
    </div>
  );
};

export default Home;
