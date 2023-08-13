import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "./App.tsx";
import "./index.css";
import { store } from "./features/store.ts";
import { persistor } from "./features/store.ts";

export let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  console.log("prod");
  disableReactDevTools();
  baseUrl = "https://chat-api-ckbb.onrender.com";
} else if (process.env.NODE_ENV === "development") {
  console.log("dev");
  baseUrl = "http://localhost:3000";
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
