import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import App from "./App.tsx";
import "./index.css";

// const updateSocket = io("", {
//   autoConnect: false,
// });

const updateSocket = io("https://ino-uno-server.glitch.me/update", {
  autoConnect: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App updateSocket={updateSocket} />
);
