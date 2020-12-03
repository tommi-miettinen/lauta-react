import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PostTooltip from "../Post-tooltip/Post-tooltip";
import PostContent from "../Post-content/Post-content";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";
import Postmedia from "../Post-media/Post-media";
import "./Post.css";

const Post = ({
  index,
  location,
  post,
  match,
  handleReply,
  deletePost,
  findPost,
  isThread,
  isOpen,
  threadId,
  ...props
}) => {
  const [hovered, setHovered] = useState();
  const [clientPos, setClientPos] = useState({ x: "", y: "" });
  const [editing, setEditing] = useState(false);
  const [modifiedContent, setModifiedContent] = useState("");
  useEffect(() => {
    if (location.hash.includes(post._id)) {
      ref.current.scrollIntoView({ block: "center" });
    }
  }, [location.hash]);

  const category = match.url.replace(/\/|[0-9]/gm, "").toLowerCase();

  const handleReplyClick = (e) => {
    handleReply(index, post._id);
  };

  const getUrlToPost = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/threads/${category}/${id}`
      );
      const ebin = `/${category}/${result.data._id}#no${id}`;
      if (result.data) {
        props.history.push(
          isOpen ? ebin : `${match.url}/${result.data._id}#no${id}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendEdit = async (id, editedContent) => {
    setEditing(false);
    const data = {
      id,
      editedContent,
    };
    try {
      const result = await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/${category}/${id}`,
        data
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const ref = React.createRef();
  const replies = post.replies.map((reply, index) => {
    return (
      <Fragment key={index}>
        <span
          onClick={() => {
            getUrlToPost(reply);
          }}
          key={index}
          onMouseEnter={(e) => {
            setHovered(reply);
            setClientPos({ x: e.clientX, y: e.clientY });
          }}
          onMouseLeave={() => setHovered(false)}
          className="replies"
        >
          {reply}
        </span>
        {hovered === reply && (
          <PostTooltip margin={clientPos} findPost={findPost} id={reply} />
        )}
      </Fragment>
    );
  });

  const getBackgroundColor = () => {
    if (isThread && !location.hash.includes(`no${post._id}`)) {
      return "#fffff5";
    }
    if (location.hash.includes(`no${post._id}`)) {
      return "#F0C0B0";
    }
  };

  const postContainerStyle = {
    backgroundColor: getBackgroundColor(),
  };

  const ThreadSubject = () => {
    if (isThread) {
      return (
        <div className="thread-subject">
          <Link
            className="thread-subject-link"
            to={`/${match.url.split("/")[1]}/${post._id}`}
          >
            {post.title.slice(0, 200) || post.content.slice(0, 200)}
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={ref} style={{ order: index + "0" }}>
      <ThreadSubject />
      <div className="post-container" style={postContainerStyle}>
        <div className="post-info">
          <EmailIcon onClick={handleReplyClick} id="email-icon" />
          <Link
            className="id"
            to={
              isOpen
                ? `${match.url}#no${post._id}`
                : `${match.url}/${threadId}#no${post._id}`
            }
            onClick={handleReplyClick}
          >
            No. {post._id}
          </Link>
          <span style={{ margin: "0px 5px" }}>/</span>
          <span>{post.createdAt}</span>

          <div style={{ marginLeft: "auto" }}>
            {post.userId === localStorage.userId && (
              <>
                {editing && (
                  <button onClick={(e) => sendEdit(post._id, modifiedContent)}>
                    Lähetä
                  </button>
                )}
                <EditIcon
                  style={{ color: editing && "red" }}
                  id="delete-icon"
                  onClick={() => setEditing(true)}
                />
                <DeleteIcon
                  id="delete-icon"
                  onClick={() => deletePost(post._id)}
                />
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <Postmedia mediaUrl={post.mediaUrl} />
          <PostContent
            editing={editing}
            setModifiedContent={setModifiedContent}
            findPost={findPost}
            setHovered={setHovered}
            hovered={hovered}
            getUrlToPost={getUrlToPost}
            content={post.content}
          />
        </div>
        <div>
          {replies.length > 0 && "Vastaukset:"}
          {replies}
        </div>
      </div>
    </div>
  );
};

export default Post;
