import "./chatUnActive.css";
import Add from "../../images/add.png";
import { useDispatch } from "react-redux";
import { addUserModeActive } from "../../features/loginMoodSlice";

const ChatUnActive = () => {
  const dispatch = useDispatch();
  return (
    <div className="chatUnActive">
      <div className="chatUnActive-container">
        <div className="chatUnActive-icons">
          <img onClick={() => dispatch(addUserModeActive())} src={Add} alt="" />
        </div>
      </div>
      <div className="box"></div>
    </div>
  );
};

export default ChatUnActive;
