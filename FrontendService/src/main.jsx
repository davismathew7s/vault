import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

function getLibrary(provider) {
  return new Web3(provider);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </Web3ReactProvider>
  </StrictMode>
);
