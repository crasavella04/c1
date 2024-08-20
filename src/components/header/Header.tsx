import { memo } from "react";
import styles from "./styles.module.css";

interface HeaderProps {
  commentsCount: number;
  updateCount: number;
}

export default memo(function Header({
  commentsCount,
  updateCount,
}: HeaderProps) {
  return (
    <header className={styles.main}>
      <img style={{ width: "150px" }} src="/logo.png" alt="logo" />
      <button>Сохранить</button>
      <div>Количество комментариев: {commentsCount}</div>
      <div>Количество изменений: {updateCount}</div>
    </header>
  );
});
