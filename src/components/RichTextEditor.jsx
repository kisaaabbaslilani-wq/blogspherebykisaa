import { useEffect, useRef } from "react";
import {
FaBold,
FaItalic,
FaUnderline,
FaHeading,
FaListUl,
FaListOl,
FaQuoteRight,
FaLink,
} from "react-icons/fa";

function Tool({ onClick, title, children }) {
return (
<button
type="button"
className="rte-btn"
title={title}
aria-label={title}
onMouseDown={(e) => e.preventDefault()}
onClick={onClick}
>
{children} </button>
);
}


  function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write here...",
  }) {
  const ref = useRef(null);

useEffect(() => {
const el = ref.current;
if (el && value !== el.innerHTML) {
el.innerHTML = value;
}
}, [value]);

const emit = () => onChange(ref.current?.innerHTML || "");

const exec = (command, arg) => {
ref.current?.focus();
document.execCommand(command, false, arg);
emit();
};

const addLink = () => {
const url = window.prompt("Enter a URL");
if (url) exec("createLink", url);
};

return ( <div className="rte"> <div className="rte-toolbar">
<Tool title="Bold" onClick={() => exec("bold")}> <FaBold /> </Tool>

    <Tool title="Italic" onClick={() => exec("italic")}>
      <FaItalic />
    </Tool>

    <Tool title="Underline" onClick={() => exec("underline")}>
      <FaUnderline />
    </Tool>

    <span className="rte-sep" />

    <Tool title="Heading" onClick={() => exec("formatBlock", "<h2>")}>
      <FaHeading />
    </Tool>

    <Tool
      title="Quote"
      onClick={() => exec("formatBlock", "<blockquote>")}
    >
      <FaQuoteRight />
    </Tool>

    <span className="rte-sep" />

    <Tool
      title="Bullet list"
      onClick={() => exec("insertUnorderedList")}
    >
      <FaListUl />
    </Tool>

    <Tool
      title="Numbered list"
      onClick={() => exec("insertOrderedList")}
    >
      <FaListOl />
    </Tool>

    <span className="rte-sep" />

    <Tool title="Add link" onClick={addLink}>
      <FaLink />
    </Tool>
  </div>

  <div
    ref={ref}
    className="rte-content"
    contentEditable
    role="textbox"
    aria-multiline="true"
    data-placeholder={placeholder}
    onInput={emit}
    suppressContentEditableWarning
  />
</div>

);
}

export default RichTextEditor;
