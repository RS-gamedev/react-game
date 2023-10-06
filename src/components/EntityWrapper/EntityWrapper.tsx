import React from "react";
import { Hitbox } from "../../models/Hitbox";
import { Size } from "../../models/Size";
import styles from "./EntityWrapper.module.css";

type props = {
  selected: boolean;
  hitBox: Hitbox;
  size: Size;
  children: JSX.Element;
  onClick: (e: any) => void;
};

const EntityWrapper = React.memo(({ children, selected, onClick, size, hitBox }: props) => {
  console.log("rendering entity wrapper");
  return (
    <div
      onClick={onClick}
      className={styles[selected ? `active` : `not-active`] + " " + styles["entity"]}
      style={{
        width: size.width,
        height: size.height,
        left: hitBox.leftTop.x,
        top: hitBox.leftTop.y,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
});

export default EntityWrapper;
