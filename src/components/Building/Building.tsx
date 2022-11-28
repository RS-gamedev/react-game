import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Hitbox } from "../../models/Hitbox";
import Icon from "../Icon/Icon";
import styles from "./Building.module.css";

type props = {
  id: string;
  size: { width: number; height: number };
  hitBox: Hitbox;
  icon?: IconProp;
  color: string;
  selected: boolean;
  onClick: (event: any, buildingId: string) => void;
  onRightClick: (event: any, buildingId: string) => void;
  image?: string;
};

const Building = React.memo(({ id, size, hitBox, icon, color, onClick, selected, onRightClick, image }: props) => {
  return (
    <div
      className={styles[selected ? `active` : `not-active`] + " " + styles["building"]}
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
      onClick={(event) => onClick(event, id)}
      onContextMenu={(event) => onRightClick(event, id)}
    >
      <Icon fontSize={size.width - 10 + "px"} color={color} imageName={image} height={size.height - 10 + "px"}></Icon>
    </div>
  );
});

export default Building;
