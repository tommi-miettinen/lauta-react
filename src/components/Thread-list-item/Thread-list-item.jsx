import React from "react";
import { Link } from "react-router-dom";

import DeleteIcon from "@material-ui/icons/Delete";
import "./Thread-list-item.css";

const ThreadListItem = props => {
  const userCount = new Set(props.thread.posts.map(post => post.userId)).size;

  console.log(props.index % 2);
  return (
    <div
      className="thread-list-item"
      style={{ backgroundColor: props.index % 2 === 1 && "#fffff5" }}
    >
      <Link
        style={{ fontWeight: 300, fontSize: 20, marginLeft: 5 }}
        className="link"
        to={`${props.match.url}/${props.thread._id}`}
      >
        {props.thread.title || props.thread.content}
      </Link>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <span>
          {props.thread.createdAt}{" "}
          <DeleteIcon
            id="delete-icon"
            onClick={() => props.deleteThread(props.thread._id)}
          />
        </span>
        <span style={{ marginLeft: "auto", color: "grey" }}>
          {props.thread.posts.length > 0
            ? `${props.thread.posts.length} vastausta ${userCount} käyttäjältä`
            : "Ei vastauksia"}
        </span>
      </div>
    </div>
  );
};

export default ThreadListItem;
