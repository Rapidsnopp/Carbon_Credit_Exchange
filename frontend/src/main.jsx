import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Polyfill Buffer for Solana Web3.js
import { Buffer } from "buffer";
window.Buffer = Buffer;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
