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
  image?: string;
};

const Building = ({ id, size, hitBox, icon, color, selected, image }: Props) => {
  return (
    <div className={styles["building"]}>
      <Icon fontSize={size.width - 15 + "px"} color={color} imageName={image} height={size.height - 15 + "px"}></Icon>
    </div>
  );
};

export default Building;
