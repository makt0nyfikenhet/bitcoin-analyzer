// Libs
import { ReactNode } from "react";
import cx from "classnames";
// Styles
import styles from "./Span.module.css";

interface IProps {
  children: ReactNode;
  className?: string;
}

const Span = (props: IProps) => (
  <span
    className={cx(
      props.className,
      styles.structure,
      styles.normal_size,
      styles.color
    )}
  >
    {props.children}
  </span>
);

export default Span;
