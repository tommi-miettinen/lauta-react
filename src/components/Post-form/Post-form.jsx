import React, { useState, useEffect } from "react";
import axios, { post } from "axios";

import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormatItalicRoundedIcon from "@material-ui/icons/FormatItalicRounded";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import "./Post-form.css";

const Postform = ({ selectedPost, order, refresh, createThread, ...props }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [fileKey, setFileKey] = useState(true);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaOption, setMediaOption] = useState("file");
  const [errorMsg, setErrorMsg] = useState("");
  const [tag, setTag] = useState({ name: "" });

  const category = props.match.url.replace(/\/|[0-9]/gm, "").toLowerCase();
  const threadApi = `${process.env.REACT_APP_API_URL}/threads/${category}`;
  const postApi = `${process.env.REACT_APP_API_URL}/posts/${category}`;
  const apiUrl = createThread ? threadApi : postApi;

  const ref = React.createRef();

  useEffect(() => {
    ref.current.focus();
    if (selectedPost.id || content) {
      if (content.length > 0) {
        setContent(content.concat("\n", `>>${selectedPost.id}`));
        ref.current.setSelectionRange(content.length, content.length);
        return;
      }
      setContent(`>>${selectedPost.id}`);
      ref.current.setSelectionRange(content.length, content.length);
    }
  }, [selectedPost]);

  useEffect(() => {
    ref.current.focus();
    ref.current.setSelectionRange(
      content.length - tag.name.length - 1,
      content.length - tag.name.length - 1
    );
  }, [tag]);

  const resetInputs = () => {
    setErrorMsg("");
    setContent("");
    setFile("");
    setFileKey(!fileKey);
    setMediaUrl("");
  };

  const submitPost = async () => {
    const mimeType = file.type ? file.type.replace("/", "_") : "";
    const data = new FormData();
    data.append("file", file);
    const ebin = await axios.get(`${process.env.REACT_APP_API_URL}/postCount`);
    console.log(ebin);
    const predictedMediaUrl = mimeType
      ? `${process.env.REACT_APP_AWS_S3_URL}/${mimeType.split("_")[0]}/${
          ebin.data.postCount.postCount
        }.${file.name.split(".").pop()}`
      : mediaUrl.includes("youtube")
      ? mediaUrl
      : "";
    const newPost = {
      title,
      threadId: props.match.params.id,
      userId: localStorage.userId,
      content,
      mediaUrl: predictedMediaUrl,
    };
    if (content.length <= 0) {
      return setErrorMsg("Viestin pituus alle 1 merkki.");
    }
    let result;
    if (content.length > 0) {
      try {
        result = await post(apiUrl, newPost);
      } catch (error) {
        console.log(error);
        setErrorMsg("Viestin lähetys epäonnistui");
      }
      try {
        if (mimeType && result) {
          console.log(result);
          post(
            `${process.env.REACT_APP_API_URL}/upload/${category}/${mimeType}/${result.data._id}/${createThread}`,
            data
          );
        }
        if (result) {
          resetInputs();
          refresh();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMediaOptionChange = (e) => {
    setMediaUrl("");
    setFile("");
    setMediaOption(e.target.value);
  };

  const handleTagClick = (tag) => {
    setContent(content.concat(`[${tag}][/${tag}]`));
    setTag({ name: `[${tag}]` });
  };

  return (
    <div className="post-form-container" style={{ order: order + "5" }}>
      <div style={{ display: "flex" }}>
        {mediaOption === "file" && (
          <input
            className="file-input"
            key={fileKey}
            style={{
              width: "100%",
              marginRight: 3,
              height: 30,
              paddingTop: "1%",
              paddingLeft: "5px",
            }}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}
        {mediaOption === "youtube-url" && (
          <input
            className="input"
            style={{
              fontSize: "15px",

              width: "100%",
              marginRight: 3,
              height: 30,
              paddingTop: "1%",
              paddingLeft: "5px",
            }}
            placeholder="Lisää youtube linkki..."
            onChange={(e) => setMediaUrl(e.target.value)}
            value={mediaUrl}
            type="text"
          />
        )}
        <select onChange={handleMediaOptionChange} value={mediaOption}>
          <option value="file">File</option>
          <option value="youtube-url">Youtube</option>
        </select>
      </div>

      {createThread && (
        <input
          className="input"
          style={{
            marginTop: 5,
            fontSize: 17,
            width: "99%",
            height: 30,
            paddingTop: "1%",
            paddingLeft: "5px",
          }}
          placeholder="Aihe"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
        />
      )}
      <div
        style={{
          display: "flex",
        }}
      >
        <FormatBoldIcon
          className="icon"
          style={{ fontSize: 24 }}
          onClick={() => handleTagClick("b")}
        />
        <FormatItalicRoundedIcon
          className="icon"
          style={{ fontSize: 24 }}
          onClick={() => handleTagClick("em")}
        />
        <VisibilityOffIcon
          className="icon"
          style={{
            fontSize: 22,
            paddingLeft: 1,
            height: "23px",
          }}
          onClick={() => handleTagClick("spoiler")}
        />
      </div>
      <textarea
        ref={ref}
        className="post-form"
        placeholder="Viesti"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        style={{
          color: "black",
          height: 30,
          textTransform: "none",
          borderRadius: "0px",
        }}
        variant="outlined"
        onClick={() => submitPost()}
      >
        Lähetä
      </Button>
      <span style={{ float: "right", color: "red" }}>{errorMsg}</span>
    </div>
  );
};

export default Postform;
