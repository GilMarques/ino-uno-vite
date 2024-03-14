import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import App from "./App.tsx";
import "./index.css";

const updateSocket = io("http://localhost:3000/update", {
  autoConnect: false,
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <App updateSocket={updateSocket} />
);
