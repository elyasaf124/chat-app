import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/loginMoodSlice.ts";
import searchReducer from "../features/searchSlice.ts";
import chatReducer from "../features/chatSlice.ts";

const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
