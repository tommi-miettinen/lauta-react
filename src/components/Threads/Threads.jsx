import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios, { get } from "axios";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import ThreadCard from "../Thread-card/Thread-card";
import ThreadList from "../Thread-list/Thread-list";
import Thread from "../Thread/Thread";
import PostForm from "../Post-form/Post-form";
import GridOnIcon from "@material-ui/icons/GridOn";
import ListIcon from "@material-ui/icons/List";
import ReorderIcon from "@material-ui/icons/Reorder";
import { makeStyles } from "@material-ui/core/styles";
import "./Threads.css";

const useStyles = makeStyles({
  icon: {
    color: "#800",
    "&:hover": { color: "red", cursor: "pointer" },
  },
});

const Threads = (props) => {
  const [createThread, setCreateThread] = useState(false);
  const [threads, setThreads] = useState([]);
  const [eepos, eepost] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, [props]);

  const category = props.match.url.replace(/\/|[0-9]/gm, "").toLowerCase();

  const fetchThreads = async () => {
    try {
      const result = await get(
        `${process.env.REACT_APP_API_URL}/threads/${category}`
      );
      setThreads(result.data);
    } catch (error) {
      console.log(process.env.REACT_APP_API_URL);
      console.log(error);
    }
  };

  const setView = (view) => {
    localStorage.view = view;
    eepost(!eepos);
  };

  const deleteThread = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/threads/${category}/${id}`
      );
      fetchThreads();
    } catch (error) {
      console.log(error);
    }
  };

  const submitted = () => {
    setCreateThread(false);
    fetchThreads();
  };

  const classes = useStyles();

  const breadcrumbs = (
    <div className="breadcrumb-container">
      <Link id="breadcrumb" to="/">
        Lauta
      </Link>
      <span style={{ padding: 5, fontSize: 20, color: "#800" }}>/</span>
      <Link
        id="breadcrumb"
        to={`/${category}`}
        replace={props.location.pathname === `/${category}`}
      >
        {category.replace(category[0], category[0].toUpperCase())}
      </Link>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <h1
        style={{
          margin: "auto",
          marginTop: -30,
          textTransform: "capitalize",
          color: "#800",
        }}
      >
        {category}
      </h1>
      <Button
        variant="contained"
        style={{
          marginLeft: "auto",
          textTransform: "none",
          backgroundColor: "#f3e6de",
          borderRadius: 0,
          color: "#800",
        }}
        onClick={() => setCreateThread((p) => !p)}
      >
        Luo lanka
      </Button>
      {createThread && (
        <PostForm
          refresh={submitted}
          {...props}
          createThread={createThread}
          selectedPost={{ id: "" }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f3e6de",
          marginLeft: "auto",
          marginBottom: "10px",
          marginTop: "10px",
        }}
      >
        <ListIcon
          onClick={() => setView("default")}
          className={classes.icon}
          style={{ fontSize: "33px" }}
        />
        <GridOnIcon
          onClick={() => setView("catalog")}
          className={classes.icon}
        />
        <ReorderIcon
          onClick={() => setView("list")}
          className={classes.icon}
          style={{ fontSize: "27px" }}
        />
      </div>
      {breadcrumbs}
      <div style={{ display: "flex" }}>
        {localStorage.view === "list" && (
          <ThreadList
            threads={threads}
            deleteThread={deleteThread}
            {...props}
          />
        )}
        {localStorage.view === "catalog" && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                {...props}
                thread={thread}
                deleteThread={deleteThread}
              />
            ))}
          </div>
        )}
        {localStorage.view === "default" && (
          <div style={{ width: "100%" }}>
            {threads.map((thread) => (
              <Thread
                key={thread._id}
                data={thread}
                deleteThreadFromPreview={deleteThread}
                {...props}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Threads;
