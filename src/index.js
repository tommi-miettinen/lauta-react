import React from "react";
import uuid from "uuid";
import ReactDOM from "react-dom";
import Routes from "./Routes";

const userId = uuid.v4();
if (!localStorage.userId) {
  localStorage.userId = userId;
}

if (!localStorage.view) {
  localStorage.view = "default";
}

ReactDOM.render(<Routes />, document.getElementById("root"));
