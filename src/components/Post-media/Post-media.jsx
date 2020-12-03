import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";

import "./Post-media.css";

const Postmedia = ({ mediaUrl, threadCard }) => {
  const [isFullsize, setIsFullsize] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const thumbnail = mediaUrl ? mediaUrl.replace("/image", "/thumbnail") : "";
  let mounted;

  useEffect(() => {
    mounted = true;
    return () => (mounted = false);
  }, [mediaUrl]);

  const handleError = (time) => {
    setLoaderVisible(true);
    setTimeout(() => {
      if (mounted) {
        setLoaderVisible(false);
      }
    }, time);
  };

  if (mediaUrl) {
    if (loaderVisible) {
      return (
        <div
          style={{
            display: "flex",
            height: "160px",
            width: threadCard ? "100%" : "160px",
          }}
        >
          <Loader />
        </div>
      );
    }
    if (mediaUrl.includes("youtube")) {
      const youtubeId = mediaUrl.split("=").pop();
      const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeId}`;
      return (
        <div className="post-media" style={{ height: "100%" }}>
          <iframe
            title="youtube"
            width="320px"
            height="180"
            src={youtubeEmbedUrl}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (mediaUrl.includes("video")) {
      return (
        <div
          style={{
            display: "flex",
            height: threadCard ? "160px" : "",
            backgroundColor: "lightgrey",
          }}
        >
          <video
            width="100%"
            style={{
              objectFit: "contain",
              maxHeight: threadCard ? "160px" : "500px",
              maxWidth: 320,
              margin: "auto",
            }}
            onError={() => handleError(10000)}
            controls={true}
          >
            <source src={mediaUrl} />
          </video>
        </div>
      );
    }

    if (mediaUrl.includes("image")) {
      return (
        <div
          style={{
            pointerEvents: threadCard && "none",
            cursor: "pointer",
          }}
        >
          <img
            width="100%"
            onError={() => handleError(2000)}
            onClick={() => setIsFullsize((p) => !p)}
            src={isFullsize ? mediaUrl : thumbnail}
            style={{
              height: threadCard ? "150px" : "100%",
              maxWidth: "700px",
              maxHeight: threadCard ? "160px" : "700px",
              objectFit: "fill",
            }}
          />
        </div>
      );
    }
    if (mediaUrl.includes("audio")) {
      return (
        <audio controls onError={() => handleError(10000)}>
          <source src={mediaUrl} />
        </audio>
      );
    }
  }
  return null;
};

export default React.memo(Postmedia);
