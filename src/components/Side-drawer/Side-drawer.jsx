import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Typography from "@material-ui/core/Typography";
import "./Side-drawer.css";

const SideDrawer = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const MenuButton = () => {
    if (openDrawer) {
      return (
        <MenuOpenIcon id="open" onClick={() => setOpenDrawer((p) => !p)} />
      );
    }
    return <MenuIcon id="closed" onClick={() => setOpenDrawer((p) => !p)} />;
  };
  return (
    <div style={{ display: "flex" }}>
      <div className={openDrawer ? "side-drawer open" : "side-drawer"}>
        <Link
          to="/sekalainen"
          className="side-drawer-nav-item"
          replace={props.location.pathname === "/sekalainen"}
        >
          <Typography>sekalainen</Typography>
        </Link>
        <Link
          to="/ei-sekalainen"
          className="side-drawer-nav-item"
          replace={props.location.pathname === "/ei-sekalainen"}
        >
          <Typography>ei-sekalainen</Typography>
        </Link>
      </div>
      <MenuButton />
    </div>
  );
};

export default withRouter(SideDrawer);
