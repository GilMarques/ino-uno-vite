import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import App from "./App.tsx";
import "./index.css";

const updateSocket = io("http://guileless-pothos-87ec59.netlify.app/", {
  autoConnect: false,
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <App updateSocket={updateSocket} />
);
