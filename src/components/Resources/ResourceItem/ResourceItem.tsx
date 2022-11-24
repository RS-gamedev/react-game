import React from "react";
import { Resource } from "../../../models/Resource";
import Icon from "../../Icon/Icon";
import styles from "./ResourceItem.module.css";

type Props = {
  resource: Resource;
  amount: number;
  iconSize: string;
  textSize: string;
  textColor: string;
  height: number;
};

export default function ResourceItem({
  resource,
  amount,
  iconSize,
  textSize,
  textColor,
  height,
}: Props) {
  return (
    <div className={styles.resourceItem}>
      <Icon
        color={resource.color}
        fontSize={iconSize}
        name={resource.icon}
        imageName={resource.image}
        height={height + "px"}
      ></Icon>
      <span style={{ fontSize: textSize, fontWeight: "600", color: textColor }}>
        {Math.round(amount)}
      </span>
    </div>
  );
}
