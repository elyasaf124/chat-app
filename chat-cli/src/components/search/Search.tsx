import { useState } from "react";
import { data } from "../../scripts/fetchIntialData";
import { IData } from "../../types/dataTypes";
import { IRefUser } from "../../types/userTypes";
import { AuthState } from "../../features/loginMoodSlice";
import { IMessage } from "../../types/messagesType";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchActive,
  setSearchUnActive,
  setSearchUsers,
} from "../../features/searchSlice";
import "./search.css";

const Search = () => {
  const dispatch = useDispatch();
  const [_, setSearchWord] = useState("");
  const userContactList = useSelector(
    (state: AuthState) => state.auth.userContact
  );

  const search = (
    e: React.FormEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchValue = (e.target as HTMLInputElement).value;
    if (searchValue !== "") {
      dispatch(setSearchActive());
      const chatsList = data?.filter((chat: IData) => {
        return userContactList?.some((user: IRefUser) => {
          return (
            user.userName.toLowerCase().includes(searchValue.toLowerCase()) &&
            chat.chat.members.includes(user.idRef._id)
          );
        });
      });

      // Create a new array of chat objects with updated 'chatMsgs' property
      const chatsListFilter = chatsList?.map((chat: IData) => {
        return {
          ...chat,
          chatMsgs: chat.chatMsgs.map((msg: IMessage) => ({ ...msg })),
        };
      });

      dispatch(setSearchUsers(chatsListFilter || []));
    } else {
      dispatch(setSearchUnActive());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  return (
    <div className="search">
      <div
        onKeyDown={(e) => search(e)}
        onChange={(e) => search(e)}
        className="search-container"
      >
        <input
          onChange={(e) => handleChange(e)}
          className="search-input"
          placeholder="Find a user"
        />
      </div>
    </div>
  );
};

export default Search;
