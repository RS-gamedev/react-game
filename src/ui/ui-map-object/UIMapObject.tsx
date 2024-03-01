import React, { memo } from "react";
import Icon from "../../components/Icon/Icon";
import styles from "./UIMapObject.module.css";

type Props = {
  showTaskAssigned: boolean;
  stockRemaining: number;
  stockMax: number;
  name: string;
};

const UIMapObject = ({ showTaskAssigned, stockMax, stockRemaining, name }: Props) => {
    console.log("rendered UIMapObject");
  return (
    <div className={styles.mapObject + " " + (showTaskAssigned ? styles.taskAssigned : styles.taskAssignedAfter)}>
      <Icon fontSize="1em" imageName={name}></Icon>
      {stockRemaining < stockMax && (
        <progress className={styles.inventoryProgressBar} style={{ width: "100%" }} value={stockRemaining} max={stockMax}></progress>
      )}
    </div>
  );
};

export default UIMapObject;
