import React from "react";
import Thread from "../Thread/Thread";

const ThreadsPreview = props => {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {props.threads.map(thread => (
        <Thread data={thread} frontpage={true} {...props} />
      ))}
    </div>
  );
};

export default ThreadsPreview;
