import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loader = () => {
  return (
    <div style={{ margin: "auto" }}>
      <CircularProgress style={{ color: "#800" }} />
    </div>
  );
};

export default Loader;
