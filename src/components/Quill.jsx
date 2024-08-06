import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './Quill.css';

const Quill = () => {
  const [content, setContent] = useState("");

  const handleEditorChange = (value) => {
    setContent(value);
  };

  return (
    <>
      <ReactQuill
        className="quill"
        value={content}
        name="content"
        theme="snow"
        onChange={handleEditorChange}
        modules={{
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
          },
        }}
      />
      <div
        className="quill-content"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          fontFamily: "'Outfit Variable', sans-serif",
          lineHeight: 1.5,
          color: "#111",
        }}
      />
      <div>{content}</div>
    </>
  );
};

export default Quill;
