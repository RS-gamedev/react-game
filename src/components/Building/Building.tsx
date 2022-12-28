import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Hitbox } from "../../models/Hitbox";
import Icon from "../Icon/Icon";
import styles from "./Building.module.css";

type Props = {
  id: string;
  size: { width: number; height: number };
  hitBox: Hitbox;
  icon?: IconProp;
  color: string;
  selected: boolean;
  onClick: (event: any, buildingId: string) => void;
  onRightClick: (event: any, buildingId: string) => void;
  level: number,
  constructionPercentage: number,
  image?: string;
};

const Building = React.memo(({ id, size, hitBox,level, constructionPercentage, icon, color, onClick, selected, onRightClick, image }: Props) => {
  return (
    <div
      className={styles[selected ? `active` : `not-active`] + " " + styles["building"]}
      style={{
        left: hitBox.leftTop.x,
        top: hitBox.leftTop.y,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onClick={(event) => onClick(event, id)}
      onContextMenu={(event) => onRightClick(event, id)}
    >
      <Icon fontSize={size.width - 10 + "px"} color={color} imageName={(level === 0) ? "underConstruction" :image} height={size.height - 10 + "px"}></Icon>
      {(level === 0) && <progress className={styles.buildingProgressBar} style={{width:'100%'}} value={constructionPercentage} max={100}></progress>}
    </div>
  );
});

export default Building;
