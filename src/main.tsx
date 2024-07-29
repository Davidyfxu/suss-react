import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./index.tsx";

console.log(import.meta.env.VITE_API_URL); // Output: http://localhost:3000/api
console.log(import.meta.env.VITE_APP_NAME); // Output: MyApp
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
