import React from "react";
import ThreadListItem from "../Thread-list-item/Thread-list-item";

const ThreadList = (props) => {
  return (
    <div style={{ width: "100%" }}>
      {props.threads.map((thread, index) => (
        <ThreadListItem
          key={thread._id}
          thread={thread}
          deleteThread={props.deleteThread}
          index={index}
          {...props}
        />
      ))}
    </div>
  );
};

export default ThreadList;
