import React, { SyntheticEvent, useCallback, useEffect } from "react";
import { useVillagers } from "../../hooks/useVillagers";
import { Hitbox } from "../../models/Hitbox";
import { Size } from "../../models/Size";
import styles from "./EntityWrapper.module.css";

type props = {
  selected: boolean;
  hitBox: Hitbox;
  size: Size;
  entityId: string;
  children: React.ReactNode;
  onClick?: (e: SyntheticEvent) => void;
  onRightClick?: (e: SyntheticEvent) => void;
};

const EntityWrapper = React.memo(({ selected, size, onClick, onRightClick, hitBox, entityId, children }: props) => {

  useEffect(() => {
    console.log("EntityWrapper useEffect");
  }, [children])

  console.log("rendering entitywrapper");
  return (
    <div
      key={entityId}
      onClick={onClick}
      onContextMenu={onRightClick}
      className={styles[selected ? `active` : `not-active`] + " " + styles["entity"]}
      style={{
        width: size.width + "px",
        height: size.height + "px",
        left: hitBox.leftTop.x + "px",
        top: hitBox.leftTop.y + "px",
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
