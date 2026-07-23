import type { ReactNode } from "react";

import styles from "./Button.module.css";

interface ButtonProps {
  children: ReactNode;
}

export function Button({ children }: ButtonProps) {
  return (
    <button className={styles.button} type="button">
      {children}
    </button>
  );
}
