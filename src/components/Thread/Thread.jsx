import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../Post/Post";
import Postform from "../Post-form/Post-form";
import "./Thread.css";

const Thread = (props) => {
  const [order, setOrder] = useState(401);
  const [selectedPost, setSelectedPost] = useState({ id: "" });
  const [thread, setThread] = useState(
    props.data || {
      _id: "",
      title: "",
      content: "",
      mediaUrl: "",
      posts: [],
      replies: [],
    }
  );
  const [slicePosts, setSlicePosts] = useState(-3);

  const isOpen = props.match.params.id !== undefined;

  useEffect(() => {
    if (!props.data) fetchThread();
  }, [props.match.params.id, props]);

  const category = props.match.url.replace(/\/|[0-9]/gm, "").toLowerCase();

  const fetchThread = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/threads/${category}/${props.match.params.id}`
      );
      if (result.data) {
        setThread(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findPost = (id) => {
    if (id === thread._id) {
      return thread;
    }
    const post = thread.posts.filter((post) => post._id === id)[0];
    return post;
  };

  const deleteThread = async (id) => {
    const category = props.match.url.replace(/\/|[0-9]/gm, "").toLowerCase();
    try {
      const result = await axios.delete(
        `${process.env.REACT_APP_API_URL}/threads/${category}/${id}`
      );
      if (result && isOpen) {
        props.history.push(`/${category}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    try {
      const result = await axios.delete(
        `${process.env.REACT_APP_API_URL}/posts/${category}/${id}`
      );
      if (result.status === 200) {
        setThread({
          ...thread,
          posts: thread.posts.filter((post) => post._id !== id),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = (index, id) => {
    setSelectedPost({ ...selectedPost, id: id });
    setOrder(index);
  };

  const refresh = () => {
    fetchThread();
    setOrder(401);
  };

  const OriginalPost = () => {
    return (
      <Post
        {...props}
        key={thread._id}
        index={0}
        post={thread}
        handleReply={handleReply}
        deletePost={isOpen ? deleteThread : props.deleteThreadFromPreview}
        findPost={findPost}
        isOpen={isOpen}
        threadId={thread._id}
        isThread={true}
      />
    );
  };

  const Posts = () => {
    return thread.posts
      .slice(isOpen ? 0 : slicePosts)
      .map((post, index) => (
        <Post
          {...props}
          key={post._id}
          index={index + 1}
          post={post}
          handleReply={handleReply}
          isOpen={isOpen}
          threadId={thread._id}
          deletePost={deletePost}
          findPost={findPost}
        />
      ));
  };

  const ShowMoreRepliesButton = () => {
    if (!isOpen && thread.posts.length > 3) {
      return (
        <div>
          {Math.abs(slicePosts) < thread.posts.length && (
            <button
              className="showmore-button"
              onClick={() => setSlicePosts(slicePosts - 10)}
            >
              Näytä aiemmat vastaukset
            </button>
          )}
          {Math.abs(slicePosts) >= thread.posts.length && (
            <button
              className="showmore-button"
              onClick={() => setSlicePosts(-3)}
            >
              Piilota aiemmat vastaukset
            </button>
          )}
          <span>{`${
            Math.abs(slicePosts) > thread.posts.length
              ? thread.posts.length
              : Math.abs(slicePosts)
          }/${thread.posts.length}`}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="thread">
      <OriginalPost />
      <Posts />
      {isOpen && (
        <Postform
          {...props}
          refresh={refresh}
          threadId={thread._id}
          selectedPost={selectedPost}
          order={order}
        />
      )}
      <ShowMoreRepliesButton />
    </div>
  );
};

export default Thread;
