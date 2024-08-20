import { memo } from "react";
import { useEditor } from "../../hooks/useEditor";
import { IComment } from "../../types/IComment";
import styles from "./styles.module.css";

interface EditorProps {
  htmlContent: string;
  addComment: (comment: IComment) => void;
  incrementCountUpdates: () => void;
}

export default memo(function Editor({
  addComment,
  htmlContent,
  incrementCountUpdates,
}: EditorProps) {
  const {
    createBold,
    createItalic,
    createUnderline,
    editorRef,
    toolbarRef,
    inputRef,
    toolbarPosition,
    toolbarVisible,
    isInputVisible,
  } = useEditor(addComment, incrementCountUpdates);

  return (
    <div className={styles.main}>
      {toolbarVisible && (
        <span
          ref={toolbarRef}
          className={styles.toolbar}
          style={{
            top: toolbarPosition.top + "px",
            left: toolbarPosition.left + "px",
          }}
        >
          <div>
            <button onClick={createBold}>B</button>
            <button onClick={createItalic}>I</button>
            <button onClick={createUnderline}>U</button>
          </div>
          <input
            style={{ display: isInputVisible ? "inline" : "none" }}
            ref={inputRef}
            type="text"
            placeholder="Добавьте комментарий"
          />
        </span>
      )}
      <div
        ref={editorRef}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
});
