import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Postmedia from "../Post-media/Post-media";
import PostContent from "../Post-content/Post-content";
import DeleteIcon from "@material-ui/icons/Delete";
import "./Thread-card.css";

const ThreadCard = ({
  deleteThread,
  thread: { title, content, mediaUrl, posts, _id },
  history,
  match,
}) => {
  const userCount = new Set(posts.map((post) => post.userId)).size;
  return (
    <Paper square style={{ color: "#800" }} className="thread-card">
      <div className="header">
        <Typography
          className="title"
          onClick={() => history.push(`${match.url}/${_id}`)}
        >
          {title ? title : content.slice(0, 10)}
        </Typography>
        <DeleteIcon id="delete-icon" onClick={() => deleteThread(_id)} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="post-media-container"
          onClick={() => history.push(`${match.url}/${_id}`)}
          style={{ maxHeight: "160px" }}
        >
          <Postmedia mediaUrl={mediaUrl} threadCard={true} />
        </div>
        <PostContent threadCard={true} tooltip={true} content={content} />
      </div>
      <Typography
        style={{
          marginTop: "auto",
          marginBottom: "0px",
          color: "gray",
          fontSize: "14px",
        }}
      >
        {posts.length} replies from {userCount} users
      </Typography>
    </Paper>
  );
};

export default ThreadCard;
