import React, { SyntheticEvent } from "react";
import { useVillagers } from "../../hooks/useVillagers";
import { Hitbox } from "../../models/Hitbox";
import { Size } from "../../models/Size";
import styles from "./EntityWrapper.module.css";

type props = {
  selected: boolean;
  hitBox: Hitbox;
  size: Size;
  children: JSX.Element;
  entityId: string;
  onClick: (e: SyntheticEvent, id: string) => void;
  // onRightClick: (e: SyntheticEvent, id: string) => void;
};

const EntityWrapper = React.memo(({ children, selected, size, onClick, hitBox, entityId }: props) => {
  // const { villagers, moveVillager } = useVillagers();

  console.log("MapObject Render");

  // const selectedVillager = villagers.find((vill) => vill.selected);

  const handleClick = (e: SyntheticEvent) => onClick(e, entityId);
  const handleRightClick = (e: any) => {
    // if (selectedVillager) {
      // update villager to gather from mapObject
    // }
  };
  return (
    <div
      key={entityId}
      onClick={handleClick}
      onContextMenu={handleRightClick}
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
