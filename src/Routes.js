import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import FrontPage from "./components/Front-page/Front-page";
import SideDrawer from "./components/Side-drawer/Side-drawer";
import Threads from "./components/Threads/Threads";
import Thread from "./components/Thread/Thread";
import "./app.css";

const Routes = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "100%",
        }}
      >
        <SideDrawer />
        <div
          style={{
            width: "100%",
            alignSelf: "stretch",
            marginTop: "50px",
            marginLeft: "-23px",
          }}
        >
          <Route path="/" exact render={(props) => <FrontPage {...props} />} />
          <Route
            path="/sekalainen"
            exact
            render={(props) => <Threads {...props} />}
          />
          <Route
            path="/sekalainen/:id"
            exact
            render={(props) => <Thread {...props} />}
          />
          <Route
            path="/ei-sekalainen"
            exact
            render={(props) => <Threads {...props} />}
          />
          <Route
            path="/ei-sekalainen/:id"
            exact
            render={(props) => <Thread {...props} />}
          />
        </div>
      </div>
    </Router>
  );
};

export default Routes;
