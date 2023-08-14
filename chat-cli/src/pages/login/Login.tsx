import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginStatus, setUserDetails } from "../../features/loginMoodSlice";
import "./login.css";
import { baseUrl } from "../../main";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errorLogin, setErrorLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const login = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    if (user.email === "" || user.password === "") {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }
    console.log("login");
    try {
      await axios
        .create({ withCredentials: true })
        .post(`${baseUrl}/user/login`, {
          email: user.email,
          password: user.password,
        })
        .then((res) => {
          dispatch(setLoginStatus());
          dispatch(setUserDetails(res.data.user));
          navigate("/");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error: any) {
      setErrorLogin(true);
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-box">
          <form onSubmit={(e) => login(e)} className="register-form">
            <div className="top">
              <h4 className="title-register-form">Elyasaf Chat</h4>
              <span className="sub-title">Login</span>
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
              />
            </div>
            {errorLogin && (
              <span className="error-login-msg">* {errorMsg}</span>
            )}
            <button className="register-form-btn" onClick={(e) => login(e)}>
              {loading ? <span className="loader"></span> : "Sign in"}
            </button>
            <span className="to-login-text">
              do not have an account?
              <a
                className="to-login-comp"
                onClick={() => navigate("/register")}
              >
                {" "}
                sign up
              </a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
