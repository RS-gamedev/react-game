import React from "react";
import { Inventory } from "../../models/Inventory";
import ResourceItem from "./ResourceItem/ResourceItem";
import styles from "./Resources.module.css";
type Props = {
  inventory: Inventory;
  itemsHeight: number;
};

const Resources = React.memo(({ inventory, itemsHeight }: Props) => {
  return (
    <div className={styles.resources}>
      {inventory.resources.map((item, index) => {
        return (
          <ResourceItem
            key={index}
            resource={item.resource}
            amount={item.amount}
            iconSize={"1.5em"}
            textSize={"0.8em"}
            textColor="#000000"
            iconHeight={"1.5em"}
            height={itemsHeight}
            width={itemsHeight}
          ></ResourceItem>
        );
      })}
    </div>
  );
});

export default Resources;
