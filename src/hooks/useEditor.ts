import { useEffect, useRef, useState } from "react";
import { currentTime } from "../helpers/currentTime";
import { IComment } from "../types/IComment";

let count = 1;
let selectionParagraph: null | Range = null;

export const useEditor = (
  addComment: (comment: IComment) => void,
  incrementCountUpdates: () => void
) => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [isInputVisible, setIsInputVisible] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToolbar = (event: MouseEvent) => {
    event.preventDefault();
    const width = toolbarRef?.current?.clientWidth || 0;
    const height = toolbarRef?.current?.clientHeight || 0;

    setToolbarPosition({
      top: event.layerY - height - 20,
      left: event.layerX - width / 2,
    });
    setToolbarVisible(true);

    const selection = window.getSelection();
    let selectedHtml = "";

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const clonedContent = range.cloneContents();
      const div = document.createElement("div");
      div.appendChild(clonedContent);
      selectedHtml = div.innerHTML;
    }

    if (selectedHtml.includes("</p><p>")) {
      setIsInputVisible(false);
    } else {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      let currentNode: ParentNode | null | Node = range?.startContainer || null;

      while (currentNode && currentNode.nodeName !== "P") {
        currentNode = currentNode.parentNode;
      }
      if (currentNode && currentNode.nodeName === "P") {
        const paragraphElement = currentNode as HTMLElement;
        const paragraphRange = document.createRange();
        paragraphRange.selectNodeContents(paragraphElement);
        selectionParagraph = paragraphRange;
      }
      setIsInputVisible(true);
    }
  };

  const hideToolbar = (event: MouseEvent | Event) => {
    if (
      toolbarRef.current &&
      !toolbarRef.current.contains(event.target as Node)
    ) {
      setToolbarVisible(false);
    }
  };

  const createUnderline = () => {
    console.log(1);
    document.execCommand("underline");
    const timeEdit = "Измененно: " + currentTime();

    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
        .replace(/<u>/gi, `<span class='c1_u'  title='${timeEdit}'>`)
        .replace(/<\/u>/gi, "</span>");
      editorRef.current.innerHTML = newHtml;
    }

    setToolbarVisible(false);
    incrementCountUpdates();
  };

  const createBold = () => {
    document.execCommand("bold");
    const timeEdit = "Измененно: " + currentTime();

    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
        .replace(/<b>/gi, `<span class='c1_b'  title='${timeEdit}'>`)
        .replace(/<\/b>/gi, "</span>");
      editorRef.current.innerHTML = newHtml;
    }

    setToolbarVisible(false);
    incrementCountUpdates();
  };

  const createItalic = () => {
    document.execCommand("italic");
    const timeEdit = "Измененно: " + currentTime();

    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
        .replace(/<i>/gi, `<span class='c1_i' title='${timeEdit}'>`)
        .replace(/<\/i>/gi, "</span>");
      editorRef.current.innerHTML = newHtml;
    }

    setToolbarVisible(false);
    incrementCountUpdates();
  };

  const createNewParagraph = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();

      if (editorRef.current) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const newParagraph = document.createElement("p");
        range.insertNode(newParagraph);
        range.setStartAfter(newParagraph);
      }
    }
  };

  const createNewComment = (event: KeyboardEvent) => {
    if (!selectionParagraph) return;

    if (event.key === "Enter" && inputRef.current?.value) {
      console.log(2);
      event.preventDefault();
      const id = new Date().getTime();

      const span = document.createElement("span");
      const contents = selectionParagraph.cloneContents();
      span.appendChild(contents);
      span.setAttribute("data-id", id.toString());
      span.setAttribute(
        "title",
        `Комментарий №${count}, добавлен ${currentTime()}`
      );
      span.className = "span_comment";
      selectionParagraph.deleteContents();
      selectionParagraph.insertNode(span);

      const comment: IComment = {
        id: id.toString(),
        content: inputRef.current.value,
        number: count,
        paragraph: selectionParagraph.toString(),
      };

      addComment(comment);

      count++;
      inputRef.current.value = "";
      setToolbarVisible(false);
    }
  };

  let timer: NodeJS.Timeout | null = null;

  const checkUpdate = () => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      incrementCountUpdates();
    }, 1500);
  };

  useEffect(() => {
    editorRef?.current?.addEventListener("contextmenu", showToolbar);
    editorRef?.current?.addEventListener("input", checkUpdate);
    document.addEventListener("click", hideToolbar);
    document.addEventListener("scroll", hideToolbar);
    document.addEventListener("keydown", hideToolbar);
    document.addEventListener("keydown", createNewParagraph);
    document.addEventListener("keydown", createNewComment);

    return () => {
      editorRef?.current?.removeEventListener("contextmenu", showToolbar);
      editorRef?.current?.removeEventListener("input", checkUpdate);
      document.removeEventListener("keydown", createNewParagraph);
      document.removeEventListener("click", hideToolbar);
      document.removeEventListener("scroll", hideToolbar);
      document.removeEventListener("keydown", hideToolbar);
      document.removeEventListener("keydown", createNewComment);
    };
  }, []);

  return {
    toolbarPosition,
    toolbarVisible,
    editorRef,
    toolbarRef,
    inputRef,
    createUnderline,
    createBold,
    createItalic,
    isInputVisible,
  };
};
