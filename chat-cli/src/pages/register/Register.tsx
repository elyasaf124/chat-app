import "./register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AiFillPicture } from "react-icons/ai/";
import { setLoginStatus, setUserDetails } from "../../features/loginMoodSlice";
import { cloudinaryFunction } from "../../cloudinary";
import { IuserRegister } from "../../types/userTypes";
import { baseUrl } from "../../main";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<IuserRegister>({
    userName: undefined,
    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
    role: undefined,
    img: undefined,
  });

  const isFormValid = () => {
    return (
      user.userName &&
      user.email &&
      user.password &&
      user.passwordConfirm &&
      user.img
    );
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      if (!isFormValid()) {
        setErrorLogin(true);
        setErrorMsg("Please fill out all fields.");
        return;
      }

      setLoading(true);
      const fileData = await cloudinaryFunction(user.img, "image");

      await axios
        .post(`${baseUrl}/user/register`, {
          user,
          cloud: fileData,
        })
        .then((res) => {
          dispatch(setUserDetails(res.data.user));
          dispatch(setLoginStatus());
          navigate("/", { replace: true });
        });
    } catch (error: any) {
      setLoading(false);

      setErrorLogin(true);
      setErrorMsg(error.response.data.errorMsg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "img") {
      // @ts-ignore
      return setUser((prev) => ({ ...prev, [e.target.id]: e.target.files[0] }));
    }
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  return (
    <div className="register">
      <div className="register-container">
        <div className="register-box">
          <form onSubmit={(e) => handleSubmit(e)} className="register-form">
            <div className="top">
              <h4 className="title-register-form">Elyasaf Chat</h4>
              <span className="sub-title">Register</span>
            </div>
            <div className="register-input-container">
              <label className="register-label name">userName</label>
              <input
                id="userName"
                onChange={(e) => handleChange(e)}
                type="text"
                className="register-input name"
              />
            </div>
            <div className="register-input-container">
              <label className="register-label email"> email</label>
              <input
                id="email"
                onChange={(e) => handleChange(e)}
                type="email"
                className="register-input email"
              />
            </div>
            <div className="register-input-container">
              <label className="register-label password">password</label>
              <input
                id="password"
                onChange={(e) => handleChange(e)}
                type="password"
                className="register-input password"
                placeholder="at least 8 characters..."
              />
            </div>
            <div className="register-input-container">
              <label className="register-label password-confirm">
                password confirm
              </label>
              <input
                id="passwordConfirm"
                onChange={(e) => handleChange(e)}
                type="password"
                className="register-input password-confirm"
              />
            </div>
            <div className="add-avater-container">
              <input
                onChange={(e) => handleChange(e)}
                style={{ display: "none" }}
                type="file"
                id="img"
              />
              <label className="add-avater-container" htmlFor="img">
                <AiFillPicture size="26px" />
                <span className="add-avater-text">
                  {user.img ? user.img.name : "Add an avatar"}
                </span>
              </label>
            </div>
            {errorLogin && (
              <span className="error-login-msg">* {errorMsg}</span>
            )}
            <button
              className="register-form-btn"
              onClick={(e) => handleSubmit(e)}
            >
              {loading ? <span className="loader"></span> : "Sign up"}
            </button>
            <span className="to-login-text">
              You do have an account?
              <a className="to-login-comp" onClick={() => navigate("/login")}>
                {" "}
                login
              </a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
