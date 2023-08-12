import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./navBar.css";
import {
  AuthState,
  setLogout,
  setUserDetails,
} from "../../features/loginMoodSlice";
import { closeChat } from "../../features/chatSlice";
import { baseUrl } from "../../main";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: AuthState) => state.auth.user);

  const logout = async () => {
    await axios
      .get(`${baseUrl}/user/logout`, { withCredentials: true })
      .then((res) => {
        if (res.data.status == "success") {
          dispatch(setLogout());
          dispatch(closeChat());
          dispatch(setUserDetails({}));
          localStorage.clear();
          navigate("/login", { replace: true });
        }
      });
  };

  return (
    <div className="nav-bar">
      <div className="nav-bar-container">
        <div className="chat-title-container">
          <span className="chat-title">Elyasaf Chat</span>
        </div>
        <div className="user-details">
          <img
            src={currentUser.img.secure_url as string}
            className="nav-bar-img"
          />
          <div className="user-name">{currentUser.userName}</div>
          <button className="nav-bar-btn" onClick={() => logout()}>
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
