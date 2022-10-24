// Libs
import React from "react";
import ReactDOM from "react-dom/client";
// Service Workers
import { registerAutoSyncSW } from "@/sw";
// Components
import App from "./App";
import { ErrorBoundary } from "./components";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

registerAutoSyncSW();
