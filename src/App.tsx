import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Comments from "./components/comments/Comments";
import DragNDrop from "./components/dnd/DragNDrop";
import Editor from "./components/editor/Editor";
import Header from "./components/header/Header";
import { convertDocxToXml } from "./helpers/convertDocxToXml";
import { convertXmlToHtml } from "./helpers/convertXmlToHtml";
import { IComment } from "./types/IComment";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [countUpdates, setCountUpdates] = useState(0);

  const addComment = useCallback((newComment: IComment) => {
    setComments((prev) => [...prev, newComment]);
  }, []);

  const incrementCountUpdates = useCallback(() => {
    setCountUpdates((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (file) {
      convertDocxToXml(file)
        .then((response) => {
          const html = convertXmlToHtml(response);
          setHtmlContent(html);
        })
        .catch(() => setFile(null));
    }
  }, [file]);

  return (
    <>
      <Header commentsCount={comments.length} updateCount={countUpdates} />
      {file === null && (
        <DndProvider backend={HTML5Backend}>
          <DragNDrop setFile={setFile} />
        </DndProvider>
      )}

      {file && htmlContent !== null && (
        <div
          style={{
            display: "flex",
            gap: "32px",
            justifyContent: "center",
            margin: "24px 0",
          }}
        >
          <Editor
            incrementCountUpdates={incrementCountUpdates}
            addComment={addComment}
            htmlContent={htmlContent}
          />
          <Comments comments={comments} />
        </div>
      )}
    </>
  );
}

export default App;
