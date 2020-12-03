import React, { useState } from "react";
import PostTooltip from "../Post-tooltip/Post-tooltip";
import "./Post-content.css";

const PostContent = ({
  editing,
  setModifiedContent,
  content,
  findPost,
  tooltip,
  getUrlToPost,
  threadCard,
}) => {
  const [tooltipIdentifier, setTooltipIdentifier] = useState({
    id: "",
    index: "",
  });
  const [indexesOfVisibleSpoilers, setIndexesOfVisibleSpoilers] = useState([]);

  const toggleSpoiler = (index) => {
    if (indexesOfVisibleSpoilers.includes(index)) {
      return setIndexesOfVisibleSpoilers(
        indexesOfVisibleSpoilers.filter((item) => item !== index)
      );
    }
    setIndexesOfVisibleSpoilers([...indexesOfVisibleSpoilers, index]);
  };

  const parseContent = () => {
    const idRegex = />>\d+/gm;
    const greentextRegex = /^>[^>\n].*/gm;
    const bluetextRegex = /^<[^<\n].*/gm;
    const hyperlinkRegex = /http[^\s]+/gm;
    const bold = /\[b].+?\[\/b]/gm;
    const italic = /\[em].+?\[\/em]/gm;
    const spoiler = /\[spoiler].+?\[\/spoiler]/gm;
    let editedContent;
    editedContent = content.replace(greentextRegex, "/s/$&/s/");
    editedContent = editedContent.replace(bluetextRegex, "/s/$&/s/");
    editedContent = editedContent.replace(idRegex, "/s/$&/s/");
    editedContent = editedContent.replace(hyperlinkRegex, "/s/$&/s/");
    editedContent = editedContent.replace(bold, "/s/$&/s/");
    editedContent = editedContent.replace(italic, "/s/$&/s/");
    editedContent = editedContent.replace(spoiler, "/s/$&/s/");
    const parts = editedContent.split("/s/");
    const result = parts.map((part, index) => {
      if (part.match(greentextRegex)) {
        return (
          <span key={index} className="greentext">
            {part}
          </span>
        );
      }
      if (part.match(bluetextRegex)) {
        return (
          <span key={index} className="bluetext">
            {part}
          </span>
        );
      }
      if (part.match(spoiler)) {
        return (
          <span
            className={
              indexesOfVisibleSpoilers.includes(index)
                ? "spoiler-open"
                : "spoiler"
            }
            onClick={() => toggleSpoiler(index)}
          >
            {part.slice("[spoiler]".length, part.length - "[/spoiler]".length)}
          </span>
        );
      }
      if (part.match(bold)) {
        return (
          <b key={index}>
            {part.slice("[b]".length, part.length - "[/b]".length)}
          </b>
        );
      }
      if (part.match(italic)) {
        return (
          <i key={index}>
            {part.slice("[em]".length, part.length - "[/em]".length)}
          </i>
        );
      }
      if (part.match(idRegex) && (!threadCard || !tooltip)) {
        const id = +part.slice(">>".length);
        return (
          <span
            onClick={() => {
              getUrlToPost(id);
            }}
            onMouseEnter={() => {
              setTooltipIdentifier({ id, index });
            }}
            onMouseLeave={() => setTooltipIdentifier({ id: "", index: "" })}
            key={index}
            className="nav-item"
          >
            {part}
            {tooltipIdentifier.id === id &&
              tooltipIdentifier.index === index && (
                <PostTooltip findPost={findPost} id={id} />
              )}
          </span>
        );
      }
      if (part.match(idRegex) && (threadCard || tooltip)) {
        return (
          <span key={index} className="nav-item">
            {part}
          </span>
        );
      }

      if (part.match(hyperlinkRegex)) {
        return (
          <a href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
    return result;
  };

  const postContent = parseContent();
  return (
    <div
      contentEditable={editing}
      onInput={(e) => setModifiedContent(e.target.textContent)}
      className={threadCard ? "" : "content"}
    >
      {postContent}
    </div>
  );
};

export default PostContent;
