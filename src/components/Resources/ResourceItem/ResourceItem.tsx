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
  iconHeight: string;
  height: string;
  width:string;
};

export default function ResourceItem({ resource, amount, iconSize, textSize, textColor, height, iconHeight, width }: Props) {
  return (
    <div className={styles.resourceItem} style={{height: height, width: width}}>
      <Icon color={resource.color} fontSize={iconSize} name={resource.icon} imageName={resource.image} height={iconHeight}></Icon>
      <span style={{ fontSize: textSize, fontWeight: "600", color: textColor }}>{Math.round(amount)}</span>
    </div>
  );
}
