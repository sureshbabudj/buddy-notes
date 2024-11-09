import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Router from "./Router";
import "./style/index.scss";

const container = document.getElementById("root");
const root = createRoot(container!);
const app = (
  <BrowserRouter>
    <StrictMode>
      <Router />
    </StrictMode>
  </BrowserRouter>
);

root.render(app);
