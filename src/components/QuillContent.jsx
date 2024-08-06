import "./Quill.css";

const QuillContent = ({ content }) => {
  return (
    <div
      className="quill-content"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        fontFamily: "'Outfit Variable', sans-serif",
        lineHeight: 1.5,
        color: "#111",
      }}
    />
  );
};

export default QuillContent;
