import React, { useState, useEffect } from "react";
import axios from "axios";
import PostContent from "../Post-content/Post-content";
import YouTubeIcon from "@material-ui/icons/YouTube";
import "./Post-tooltip.css";

const PostTooltip = ({ id, findPost, margin }) => {
  const [post, setPost] = useState();

  let mounted;

  const fetchPost = async () => {
    try {
    const result = await axios.get(
      `${process.env.REACT_APP_API_URL}/posts/sekalainen/${id}`
    );
    if (mounted) {
      setPost(result.data);
    }
  }
  catch (error) {
  }
  };

  useEffect(() => {
    mounted = true;
    const found = findPost(id);
    if (found && mounted) {
      setPost(found);
    }
    if (!found && mounted) {
      fetchPost();
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  if (post) {
    const youtubeId = post.mediaUrl ? post.mediaUrl.split("=").pop() : "";
    const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
    return (
      <div
        className="tooltip-container"
        style={{
          left: margin ? margin.x - 90 : "",
        }}
      >
        <div className="post-info">
          <span>No. {post._id}</span>
          <span>{` / ${post.createdAt}`}</span>
        </div>
        <div style={{ display: "flex" }}>
          {post.mediaUrl.includes("image") && (
            <img src={post.mediaUrl} height="200px" alt="paska" />
          )}
          {post.mediaUrl.includes("youtube") && (
            <div style={{ position: "relative" }}>
              <YouTubeIcon
                className="youtube-icon"
                style={{
                  fontSize: 60,
                  color: "black",
                }}
              />
              <img src={youtubeThumbnail} height="200px" alt="paska" />
            </div>
          )}
          {post.mediaUrl.includes("video") && (
            <div>
              <video width="320" controls={true}>
                <source src={post.mediaUrl} />
              </video>
            </div>
          )}
          <PostContent tooltip={true} content={post.content} />
        </div>
        {post.replies.length > 0 && (
          <div>
            Vastaukset:
            {post.replies.map((reply) => (
              <span key={reply} className="replies">
                {reply}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      className="tooltip-container"
      style={{
        padding: "5px 10px",
        left: margin ? margin.x - 90 : "",
      }}
    >
      Viestiä ei löydetty...
    </div>
  );
};

export default PostTooltip;
