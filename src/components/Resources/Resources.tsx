import React from "react";
import { useInventory } from "../../hooks/useInventory";
import ResourceItem from "./ResourceItem/ResourceItem";
import styles from "./Resources.module.css";

const Resources = React.memo(() => {
  const { inventory } = useInventory();

  return (
    <div className={styles.resources}>
      {inventory?.resources.map((item, index) => {
        return (
          <ResourceItem
            key={index}
            resource={item.resource}
            amount={item.amount}
            iconSize={"1.5em"}
            textSize={"0.8em"}
            textColor="#000000"
            iconHeight={"1.5em"}
            height={"50px"}
            width={"50px"}
          ></ResourceItem>
        );
      })}
    </div>
  );
});

export default Resources;
