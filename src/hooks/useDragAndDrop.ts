import { useCallback, useState } from "react";

export const useDragAndDrop = (
  setState: React.Dispatch<React.SetStateAction<File | null>>
) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragging(false);
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles) setState(droppedFiles[0]);
    },
    [setState]
  );

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (selectedFiles) setState(selectedFiles[0]);
    },
    [setState]
  );

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragging(true);
    },
    []
  );

  return {
    dragging,
    handleDrop,
    handleFileInput,
    handleDragLeave,
    handleDragOver,
  };
};
