import { useState } from "react";
import "./styles.css";
export default function TextExpander({
  collapsedNumWords,
  expandButtonText,
  collapseButtonText,
  buttonColor,
  expanded,
  className,
  children,
}) {
  const fullText = children;
  const words = fullText.trim().split(/\s+/);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const buttonStyle = {
    background: "none",
    border: "none",
    marginLeft: "6px",
    color: buttonColor,
    font: "inherit",
    cursor: "pointer",
  };

  const displayedText = isExpanded
    ? fullText
    : words.slice(0, collapsedNumWords).join(" ");

  return (
    <div className={className}>
      <span>
        {displayedText}{" "}
        {!isExpanded && words.length > collapsedNumWords && "..."}
      </span>
      <button
        style={buttonStyle}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
