import styles from "./MapObject.module.css";
import React, { useState } from "react";
import { Position } from "../../models/Position";
import { Hitbox } from "../../models/Hitbox";
import Icon from "../Icon/Icon";
import { InventoryItem } from "../../models/InventoryItem";

type props = {
  id: string;
  name: string;
  position: Position;
  onClick: (event: any, id: string) => void;
  onRightClick: (event: any, mapObjectId: string) => void;
  hitBox: Hitbox;
  inventoryMax: number;
  inventory: InventoryItem[];
};

const MapObject = React.memo(({ id, name, hitBox, onClick, onRightClick, inventoryMax, inventory }: props) => {
  const [showTaskAssigned, setShowTaskAssigned] = useState<boolean>(false);

  function handleRightClick(event: any) {
    setShowTaskAssigned(() => true);
    setTimeout(() => {
      setShowTaskAssigned(() => false);
    }, 300);
    onRightClick(event, id);
  }

  return (
    <>
      {hitBox ? (
        <div
          className={
            styles.mapObject +
            " " +
            (showTaskAssigned ? styles.taskAssigned : styles.taskAssignedAfter)
          }
          onClick={(event) => onClick(event, id)}
          onContextMenu={handleRightClick}
        >
          <Icon fontSize="1em" imageName={name}></Icon>
          {(inventory[0].amount < inventoryMax) && <progress className={styles.inventoryProgressBar} style={{width:'100%'}} value={inventory[0].amount} max={inventoryMax}></progress>}
        </div>
      ) : (
        <></>
      )}
    </>
  );
});
export default MapObject;
