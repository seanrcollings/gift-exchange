import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { App } from "./components/App.tsx";
import "@radix-ui/themes/styles.css";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="dark">
      <App />
    </Theme>
  </StrictMode>
);
