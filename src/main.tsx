// Libs
import React from "react";
import ReactDOM from "react-dom/client";
// Services
import { SentryService } from "@/services";
// Service Workers
import { registerAutoSyncSW } from "@/sw";
// Components
import App from "./App";
import { ErrorBoundary } from "./components";

// Init Sentry
SentryService.run();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

registerAutoSyncSW();
