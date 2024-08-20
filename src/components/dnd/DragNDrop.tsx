import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import styles from "./styles.module.css";

interface DragNDropProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function DragNDrop({ setFile }: DragNDropProps) {
  const {
    handleDrop,
    handleFileInput,
    dragging,
    handleDragLeave,
    handleDragOver,
  } = useDragAndDrop(setFile);

  return (
    <div className={styles.container}>
      <label
        className={styles.main}
        htmlFor="fileInput"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragging ? "Отпустите файлы здесь" : "Выберите или перетащите файл"}
        <input
          id="fileInput"
          onChange={handleFileInput}
          type="file"
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}
