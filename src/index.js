import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import MyRouter from './router'
import routes from "./router";
import { renderRoutes } from "react-router-config";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    {/* <MyRouter/> */}
    {renderRoutes(routes)}
  </BrowserRouter>
);

reportWebVitals();
