import { memo } from "react";
import { IComment } from "../../types/IComment";
import styles from "./style.module.css";

interface CommentsProps {
  comments: IComment[];
}

export default memo(function Comments({ comments }: CommentsProps) {
  return (
    <div className={styles.main}>
      <h2>Комментарии</h2>
      {comments.map((comment) => (
        <div className={styles.comment} key={comment.id}>
          <h3>Комментарий №{comment.number}</h3>
          <p className={styles.paragraph}>{comment.paragraph}</p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
});
