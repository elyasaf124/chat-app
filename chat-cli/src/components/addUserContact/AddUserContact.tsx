import React, { useState } from "react";
import "./addUserContact.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { closeAddUserMode } from "../../features/loginMoodSlice";
import { baseUrl } from "../../main";

const AddUserContact = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    userName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const AddUser = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (user.email === "" || user.userName === "") return;
    try {
      await axios
        .create({ withCredentials: true })
        .post(`${baseUrl}/user/addUserContact`, {
          email: user.email,
          userName: user.userName,
        })
        .then((res) => {
          if (res.data.status === "success") {
            alert("user adding successfuly");
            dispatch(closeAddUserMode());
          }
        });
    } catch (error: any) {
      if (error.response.data.status === "fail") {
        alert("user allready exits");
      }
    }
  };
  return (
    <div
      className="add-user-content"
      onClick={() => {
        dispatch(closeAddUserMode());
      }}
    >
      <div
        className="add-user-content-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="add-user-content-title">Add user</h1>
        <form action="" className="add-user-content-form">
          <div className="register-input-container">
            <label className="register-label email">email</label>
            <input
              onChange={(e) => handleChange(e)}
              id="email"
              type="email"
              className="register-input email"
            />
          </div>
          <div className="register-input-container">
            <label className="register-label userName">userName</label>
            <input
              id="userName"
              onChange={(e) => handleChange(e)}
              type="text"
              className="register-input userName"
            />
          </div>
          <button onClick={(e) => AddUser(e)} className="register-form-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserContact;
