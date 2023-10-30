import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("ballpit");
const textureSrc = rootElement.dataset.texture || null;

if (textureSrc) {
  const root = createRoot(rootElement);
  root.render(<App texture={textureSrc} />);
}
